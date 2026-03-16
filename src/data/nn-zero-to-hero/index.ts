import { Course } from "../types";
import { microgradModule } from "./01-micrograd";
import { bigramModule } from "./02-bigram";
import { mlpModule } from "./03-mlp";
import { batchNormModule } from "./04-batch-norm";
import { backpropManualModule } from "./05-backprop-manual";
import { wavenetModule } from "./06-wavenet";
import { gptModule } from "./07-gpt";
import { tokenizerModule } from "./08-tokenizer";

export const nnZeroToHeroCourse: Course = {
  id: "nn-zero-to-hero",
  slug: "nn-zero-to-hero",
  title: "Neural Networks: Zero to Hero",
  description: "Build neural networks from scratch, progressing from micrograd to GPT. Based on Andrej Karpathy's legendary course — covers backpropagation, language modeling, transformers, and tokenization.",
  icon: "\u{1F9E0}",
  tier: "pro",
  modules: [microgradModule, bigramModule, mlpModule, batchNormModule, backpropManualModule, wavenetModule, gptModule, tokenizerModule],
};
