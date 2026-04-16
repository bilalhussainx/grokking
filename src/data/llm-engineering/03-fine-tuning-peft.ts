import { Module } from "../types";

export const module3: Module = {
  id: "fine-tuning-peft",
  title: "Fine-Tuning, LoRA & PEFT",
  description: "When to fine-tune vs prompt engineer, full fine-tuning vs LoRA, QLoRA for 4-bit fine-tuning on consumer hardware, PEFT library, and preparing training datasets",
  lessons: [
    {
      id: "fine-tuning-peft",
      slug: "fine-tuning-peft",
      title: "Fine-Tuning with LoRA & QLoRA",
      content: `# Fine-Tuning LLMs: LoRA & PEFT

Fine-tuning makes a general model excel at your specific task. LoRA makes it affordable — fine-tuning a 7B model on consumer hardware in hours instead of renting A100s for days.

---

\`\`\`concept
{
  "title": "When to Fine-Tune vs Prompt Engineer",
  "variant": "mental-model",
  "content": "Prompt engineering is free and fast but limited by context window and consistency. Fine-tuning trains the model's weights for your task — it internalizes the pattern rather than being told it each time. Fine-tune when: (1) you need a specific writing style or domain voice consistently, (2) your task has thousands of examples and needs reliability at scale, (3) latency matters and you can't afford a long system prompt on every request, (4) you're doing classification/extraction with a fixed output schema. Don't fine-tune when: you have < 100 examples, the task changes frequently, or GPT-4 with a good prompt already works."
}
\`\`\`

---

## LoRA: Low-Rank Adaptation

\`\`\`python
# LoRA insight: large weight matrices in transformers have low intrinsic rank.
# Instead of updating all weights (billions of params), LoRA adds tiny trainable
# "adapter" matrices A and B where weight update ΔW = B × A
# A: (d x r), B: (r x d), rank r << d (typically r = 4, 8, 16)

# Why this works:
# Full fine-tune: update 7B params → need 28GB VRAM in fp32
# LoRA r=16: update ~0.1% of params → fits on 16GB GPU

from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load base model:
model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1",
    device_map="auto",
)

# LoRA config:
lora_config = LoraConfig(
    r=16,                    # rank — higher = more capacity, more memory
    lora_alpha=32,           # scaling factor (usually 2 * r)
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],  # attention layers
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)

# Wrap model with LoRA adapters:
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# trainable params: 41,943,040 || all params: 7,283,052,544 || trainable%: 0.576%

# Only 0.576% of params are trained — but quality approaches full fine-tune
\`\`\`

## QLoRA: 4-bit Fine-Tuning

\`\`\`python
import torch
from transformers import BitsAndBytesConfig, AutoModelForCausalLM

# QLoRA = LoRA + 4-bit quantization of frozen weights
# 7B model: full fp32 = 28GB | 4-bit = 3.5GB → fine-tune on RTX 4090 or even 3090

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,   # extra quantization for memory
    bnb_4bit_quant_type="nf4",        # NF4: best for normally distributed weights
    bnb_4bit_compute_dtype=torch.bfloat16,
)

model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1",
    quantization_config=bnb_config,
    device_map="auto",
)

# Then apply LoRA as before:
from peft import prepare_model_for_kbit_training
model = prepare_model_for_kbit_training(model)
model = get_peft_model(model, lora_config)

# Result: fine-tune 7B model on 16GB VRAM in ~2 hours for 10k examples
\`\`\`

## Dataset Preparation

\`\`\`python
# Training data format for instruction fine-tuning (chat):
# Each example: instruction + input (optional) + output

training_examples = [
    {
        "instruction": "Classify this customer review as positive, neutral, or negative.",
        "input": "The product arrived damaged and customer service was unhelpful.",
        "output": "negative"
    },
    {
        "instruction": "Extract the company name and location from this text.",
        "input": "OpenAI, based in San Francisco, announced...",
        "output": '{"company": "OpenAI", "location": "San Francisco"}'
    },
]

# Format into Alpaca template:
def format_example(example):
    if example.get("input"):
        return f"""### Instruction:
{example['instruction']}

### Input:
{example['input']}

### Response:
{example['output']}"""
    else:
        return f"""### Instruction:
{example['instruction']}

### Response:
{example['output']}"""

# Or ChatML format (for chat models):
def format_chat(example):
    return f"""<|im_start|>system
You are a helpful assistant.<|im_end|>
<|im_start|>user
{example['instruction']}<|im_end|>
<|im_start|>assistant
{example['output']}<|im_end|>"""

# Dataset size guidelines:
# Task-specific classification: 500-2,000 examples
# Style/tone fine-tuning: 1,000-5,000 examples
# Domain knowledge: 5,000-50,000 examples
# Instruction following: 10,000+ examples (e.g., Alpaca: 52k)

# Data quality > quantity — 1,000 clean examples beats 10,000 noisy ones
\`\`\`

## Training with SFTTrainer

\`\`\`python
from trl import SFTTrainer
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir="./mistral-finetuned",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,  # effective batch = 4 * 4 = 16
    warmup_steps=100,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    save_steps=500,
    evaluation_strategy="steps",
    eval_steps=100,
    load_best_model_at_end=True,
    report_to="wandb",  # track training with Weights & Biases
)

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    peft_config=lora_config,
    dataset_text_field="text",  # field containing formatted examples
    max_seq_length=2048,
)

trainer.train()

# Save LoRA adapters (small — only adapter weights):
trainer.save_model("./adapters")  # saves only LoRA weights (~40MB for r=16)

# Load for inference:
from peft import PeftModel
base_model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-v0.1")
model = PeftModel.from_pretrained(base_model, "./adapters")

# Merge adapters into base model (optional, for faster inference):
merged_model = model.merge_and_unload()
merged_model.save_pretrained("./merged-model")
\`\`\`

\`\`\`compare
{
  "title": "Fine-Tuning Approaches",
  "items": [
    {
      "name": "Full Fine-Tuning",
      "description": "All model weights updated. Highest quality but requires massive GPU. A 7B model needs 80GB+ VRAM. Use when: you have A100 access and need max quality."
    },
    {
      "name": "LoRA (r=8-64)",
      "description": "Only adapter matrices trained. ~0.1-0.5% of params. Runs on 24GB GPU for 7B models. Quality close to full fine-tuning. Most common approach."
    },
    {
      "name": "QLoRA (4-bit + LoRA)",
      "description": "4-bit quantized base model + LoRA adapters. Fits 7B model on 16GB VRAM. Small quality loss vs LoRA, but democratizes fine-tuning. Best for resource-constrained setups."
    },
    {
      "name": "OpenAI Fine-tuning API",
      "description": "Upload JSONL dataset, pay per training token. No GPU management. Best for: GPT-3.5/4 fine-tuning without infrastructure. Expensive at scale, vendor locked."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Fine-tune when you need consistent style, domain knowledge, or structured output at scale — not for tasks a good prompt handles.", "QLoRA (4-bit + LoRA) fine-tunes a 7B model on 16GB VRAM in ~2 hours — consumer hardware is sufficient.", "Data quality matters more than quantity — 1,000 clean, consistent examples beat 10,000 noisy ones.", "LoRA saves only adapter weights (~40MB for r=16) — store and swap multiple fine-tunes cheaply.", "Merge LoRA adapters into the base model for faster inference — no adapter overhead at serving time.", "TrainingArguments: gradient_accumulation_steps compensates for small batch size — effective batch = batch_size × accumulation_steps."]
\`\`\`
`,
    },
  ],
};
