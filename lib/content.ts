/**
 * Every number and link the page shows, in one place.
 *
 * The figures here are measured, not illustrative: the benchmark scores come from
 * docs/eval*.json in the model repository, where each one was produced by the same harness
 * on the same examples: 200 per benchmark, 250 for MMLU. If a number changes there it
 * changes here, and nowhere else.
 */

export const SITE = {
  name: "Moonfrost AI",
  tagline: "A 777M-parameter Mixture-of-Experts language model, built and trained from scratch.",
  description:
    "Moonfrost AI is a 777M-parameter Mixture-of-Experts language model built and trained " +
    "scratch for about $55: its own tokenizer, Multi-head Latent Attention, DeepSeekMoE " +
    "routing, training loop and chat server. 161M parameters active per token.",
  url: "https://moonfrost-ai.vercel.app",
  author: "Ashish Kumar",
};

export const LINKS = {
  github: "https://github.com/whoashish115/moonfrost-ai",
  site: "https://github.com/whoashish115/moonfrost-ai-site",
  instruct: "https://huggingface.co/whoashish115/Moonfrost-777M-Instruct-v2",
  instructV1: "https://huggingface.co/whoashish115/Moonfrost-777M-Instruct-v1",
  base: "https://huggingface.co/whoashish115/Moonfrost-777M",
  dataset: "https://huggingface.co/datasets/whoashish115/Moonfrost-Persona-SFT",
  collection:
    "https://huggingface.co/collections/whoashish115/moonfrost-777m-6aa67a24b82a750ffcd9ef41",
  wandb: "https://wandb.ai/whoashish115-base/moonfrost-777m",
};

export const HEADLINE_STATS = [
  { value: "777M", label: "total parameters" },
  { value: "161M", label: "active per token" },
  { value: "6B", label: "training tokens" },
  { value: "$55", label: "total cost" },
];
