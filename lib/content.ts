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
