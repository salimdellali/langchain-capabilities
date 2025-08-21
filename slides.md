---
marp: true
paginate: true
header: TechGathering 2025-08-21
footer: Foci Solutions
---

# 🦜🔗 LangChain

- `LangChain` is composed of 2 words:
  - `Lang`: from "Language", refers the the use of Large Language Models (LLMs)
  - `Chain`: refers to chaining LLMs together

---

# 🦜🔗 LangChain.js (1/2)

- `LangChain.js` Simplifies working with LLMs in `JS/TS` by providing tools to:
  - manage prompts
  - model calls
  - output parsing
- Making it easier to build robust AI-powered applications and workflows
- NOTE: There is also `LangChain` for `Python`

---

# 🦜🔗 LangChain.js (2/2)

- Using the following LangChain.js packages:
  - `langchain` v0.3.0
  - `@langchain/core` v0.3.0
  - `@langchain/google-genai` v0.1.0
- Using `gemini-2.0-flash` LLM by Google, get a free API key on [AI Studio](https://aistudio.google.com)
  - Backup `gpt-4.1` LLM by OpenAI, in case Gemini will not work 🤷‍♂️

---

# Intro (1/2)

- `promptTemplate` is the prompt to be sent to the LLM, it expects 2 prompt variables:
  - `topic`
  - `nbWords`
- `stringOutputParser` is a way to instruct the LLM to return the response as `string`
- `chain` is what we call a Runnable, the `chain` is simple for now, and in this case it means
  > Send the `promptTemplate` to the `model` and return the response as `stringOutputParser`

---

# Intro (2/2)

- Lastly, the actual chain invocation with `chain.invoke()` happens where:

  - we pass `topic` and `nbWords` as prompt variables
  - store the result in `result`

- NOTE: IntelliSense will complain if there is a mismatch in the prompt variable names (show example)

---

# Feedback Analyzer (1/3)

- the `feedback-analyzer` processes customer feedback by chaining 3 AI-powered analyses:

  1. Assesses the sentiment from the feedback
  2. Identifies the issues
  3. Suggests actions to mitigate the issues found

- Returns a comprehensive report in a JSON format

---

# Feedback Analyzer (2/3)

- Sentiment chain:
  - receives as input `feedback`
  - outputs: `sentiment`
- Issues chain:
  - received as input `feedback` and `sentiment`
  - outputs: `issues`
- Actions chain:

  - receives as input: `feedback`, `sentiment`, and `issues`
  - outputs: `actions`

---

# Feedback Analyzer (3/3)

- Assemble `feedback`, `sentiment`, `issues`, and `actions` into a single comprehensive JSON file

---

# Considerations

- Depending on the length of the chain, it could become quite expensive
  - in our case, 3 separate LLM calls are being made for each `feedback-analyzer` execution
