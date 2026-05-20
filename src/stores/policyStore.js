import { defineStore } from 'pinia'

export const usePolicyStore = defineStore('policy', {
  state: () => ({
    stage: 'welcome',

    questions: [],
    currentQuestionIndex: 0,

    answers: [],

    finalRecommendation: null,

    welcomeStage: 0,
  }),

  getters: {
    currentQuestion(state) {
      return state.questions[state.currentQuestionIndex] ?? null
    },

    isFirstQuestion(state) {
      return state.currentQuestionIndex === 0
    },

    isLastQuestion(state) {
      return state.currentQuestionIndex >= state.questions.length - 1
    },

    answeredQuestionCount(state) {
      return state.answers.length
    },

    progress(state) {
      if (!state.questions.length) return 0
      return Math.round((state.answers.length / state.questions.length) * 100)
    },
  },

  actions: {
    setStage(stage) {
      this.stage = stage
    },

    setQuestions(questions) {
      this.questions = Array.isArray(questions) ? questions : []
      this.currentQuestionIndex = 0
      this.answers = []
      this.finalRecommendation = null
    },

    setCurrentQuestion(index) {
      if (index >= 0 && index < this.questions.length) {
        this.currentQuestionIndex = index
      }
    },

    addAnswer(answer) {
      this.answers.push(answer)
    },

    updateAnswer(questionId, answer) {
      const existingIndex = this.answers.findIndex(
        item => item.questionId === questionId
      )

      if (existingIndex >= 0) {
        this.answers[existingIndex] = answer
      } else {
        this.answers.push(answer)
      }
    },

    setAnswers(answers) {
      this.answers = Array.isArray(answers) ? answers : []
    },

    resetAnswers() {
      this.answers = []
      this.currentQuestionIndex = 0
      this.finalRecommendation = null
    },

    nextQuestion() {
      if (!this.isLastQuestion) {
        this.currentQuestionIndex += 1
      }
    },

    previousQuestion() {
      if (!this.isFirstQuestion) {
        this.currentQuestionIndex -= 1
      }
    },

    setFinalRecommendation(recommendation) {
      this.finalRecommendation = recommendation
    },

    nextWelcomeStage() {
      this.welcomeStage += 1
    },

    previousWelcomeStage() {
      if (this.welcomeStage > 0) {
        this.welcomeStage -= 1
      }
    },

    resetAssessment() {
      this.stage = 'welcome'
      this.currentQuestionIndex = 0
      this.answers = []
      this.finalRecommendation = null
      this.welcomeStage = 0
    },
  },
})