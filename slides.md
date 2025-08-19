---
marp: true
---

# LangChain.js

- Simplifies working with LLMs in `JavaScript/TypeScript` by providing tools:
  - to manage prompts
  - to model calls
  - and output parsing
- Making it easier to build robust AI-powered applications and workflows.
- Using the following LangChain.js packages: `langchain` `@langchain/core` and `langchain/google-genai`
- NOTE:
  - There is also `LangChain` for `Python`

---

# Intro

- Using `gemini-2.0-flash` LLM by Google, get a free API key on [AI Studio](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjPtaqyiJKPAxUjj4kEHSNDEjQQFnoECAoQAQ&url=https%3A%2F%2Faistudio.google.com%2F&usg=AOvVaw2ado6WVRi8CYsaHcreSChK&opi=89978449)
  - `temperature` controls the randomness of the output, range: [0, 1]
- `promptTemplate` is the prompt to be sent to the LLM, it expects 2 arguments: `topic` and `nbWords`
- `stringOutputParser` is a way to instruct the LLM to return the response as `string`
- `chain` is what we call a Runnable, the `chain` is simple for now, and in this case it means
  > send the `promptTemplate` to the `model` and return the response as `stringOutputParser`

---

- Lastly, the actual chain invocation with `chain.invoke()` happens where:

  - we pass `topic` and `nbWords` as parameters
  - store the result in `result`

- NOTE:
  - IntelliSense will complain if there is a mismatch between the expected parameters and received arguments (show example)
