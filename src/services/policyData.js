// src/services/policyData.js

import { policyQuestions } from '../data/policyQuestions'

export async function fetchQuestions() {
  return policyQuestions
}