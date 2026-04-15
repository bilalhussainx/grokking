import { Module } from "../types";

export const nlpFundamentalsModule: Module = {
  id: "nlp-fundamentals",
  title: "NLP Fundamentals and Text Pipelines",
  description: "Process raw text into ML-ready features using tokenization, TF-IDF, and word embeddings. Build a sentiment classifier and a simple language model.",
  lessons: [
    {
      id: "text-preprocessing",
      slug: "text-preprocessing",
      title: "Text Preprocessing: Tokenization, Stemming, and Stop Words",
      content: `# Text Preprocessing: Tokenization, Stemming, and Stop Words

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **NLP Fundamentals and Text Pipelines**." }
\\\`\\\`\\\`

## What you'll learn here

Implement a text normalization pipeline: lowercase, punctuation removal, tokenization, stop-word filtering, and stemming from scratch.

## Preview of topics

- The core ideas that make **Text Preprocessing: Tokenization, Stemming, and Stop Words** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "bag-of-words-tfidf",
      slug: "bag-of-words-tfidf",
      title: "Bag-of-Words and TF-IDF Vectorization",
      content: `# Bag-of-Words and TF-IDF Vectorization

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **NLP Fundamentals and Text Pipelines**." }
\\\`\\\`\\\`

## What you'll learn here

Build a vocabulary, compute term frequency, and implement IDF weighting. Convert a corpus into a sparse TF-IDF matrix using NumPy.

## Preview of topics

- The core ideas that make **Bag-of-Words and TF-IDF Vectorization** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "word-embeddings",
      slug: "word-embeddings",
      title: "Word Embeddings: Word2Vec Skip-Gram Intuition",
      content: `# Word Embeddings: Word2Vec Skip-Gram Intuition

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **NLP Fundamentals and Text Pipelines**." }
\\\`\\\`\\\`

## What you'll learn here

Understand distributional semantics. Implement a simplified skip-gram model and observe that similar words cluster in embedding space.

## Preview of topics

- The core ideas that make **Word Embeddings: Word2Vec Skip-Gram Intuition** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "sentiment-classifier",
      slug: "sentiment-classifier",
      title: "Sentiment Classification with Logistic Regression",
      content: `# Sentiment Classification with Logistic Regression

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **NLP Fundamentals and Text Pipelines**." }
\\\`\\\`\\\`

## What you'll learn here

Train a binary sentiment classifier on TF-IDF features. Interpret the most predictive words by examining learned weights.

## Preview of topics

- The core ideas that make **Sentiment Classification with Logistic Regression** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "recurrent-networks-intro",
      slug: "recurrent-networks-intro",
      title: "Recurrent Networks: Processing Sequences",
      content: `# Recurrent Networks: Processing Sequences

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **NLP Fundamentals and Text Pipelines**." }
\\\`\\\`\\\`

## What you'll learn here

Implement a vanilla RNN cell forward pass. Understand the vanishing gradient problem and why LSTMs were invented.

## Preview of topics

- The core ideas that make **Recurrent Networks: Processing Sequences** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "attention-transformer-intuition",
      slug: "attention-transformer-intuition",
      title: "Attention Mechanism and Transformer Intuition",
      content: `# Attention Mechanism and Transformer Intuition

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **NLP Fundamentals and Text Pipelines**." }
\\\`\\\`\\\`

## What you'll learn here

Derive scaled dot-product attention from first principles. Implement a single attention head and visualize attention weights.

## Preview of topics

- The core ideas that make **Attention Mechanism and Transformer Intuition** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "nlp-checkpoint",
      slug: "nlp-checkpoint",
      title: "Checkpoint: News Category Classifier",
      content: `# Checkpoint: News Category Classifier

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **NLP Fundamentals and Text Pipelines**." }
\\\`\\\`\\\`

## What you'll learn here

Practice checkpoint — preprocess a news headline dataset, build TF-IDF features, train a multiclass logistic regression, and report per-class F1.

## Preview of topics

- The core ideas that make **Checkpoint: News Category Classifier** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};
