export default class Validator {
	constructor(data, rules) {
		this.data = data
		this.rules = rules
		this.errors = {}
		this.isValid = true
	}

	// Validate all rules
	validate() {
		Object.keys(this.rules).forEach((field) => {
			const fieldRules = this.rules[field].split('|')
			const value = this.getValue(field)

			fieldRules.forEach((rule) => {
				this.applyRule(field, value, rule.trim())
			})
		})

		return this.isValid
	}

	// Get nested value from data
	getValue(field) {
		return field.split('.').reduce((obj, key) => {
			return obj && obj[key] !== undefined ? obj[key] : undefined
		}, this.data)
	}

	// Apply single validation rule
	applyRule(field, value, rule) {
		const [ruleName, parameter] = rule.split(':')

		switch (ruleName) {
			case 'required':
				if (value === undefined || value === null || value === '') {
					this.addError(field, `${field} is required`)
				}
				break

			case 'email':
				if (value && !this.isValidEmail(value)) {
					this.addError(field, `${field} must be a valid email`)
				}
				break

			case 'min':
				if (value && value.toString().length < parseInt(parameter)) {
					this.addError(field, `${field} must be at least ${parameter} characters`)
				}
				break

			case 'max':
				if (value && value.toString().length > parseInt(parameter)) {
					this.addError(field, `${field} must not exceed ${parameter} characters`)
				}
				break

			case 'numeric':
				if (value && !this.isNumeric(value)) {
					this.addError(field, `${field} must be numeric`)
				}
				break

			case 'integer':
				if (value && !Number.isInteger(Number(value))) {
					this.addError(field, `${field} must be an integer`)
				}
				break

			case 'in':
				const allowedValues = parameter.split(',')
				if (value && !allowedValues.includes(value.toString())) {
					this.addError(field, `${field} must be one of: ${allowedValues.join(', ')}`)
				}
				break

			case 'confirmed':
				const confirmField = `${field}_confirmation`
				if (value !== this.getValue(confirmField)) {
					this.addError(field, `${field} confirmation does not match`)
				}
				break

			case 'unique':
				// This would require database check, implement as needed
				break

			case 'exists':
				// This would require database check, implement as needed
				break
		}
	}

	// Add error message
	addError(field, message) {
		if (!this.errors[field]) {
			this.errors[field] = []
		}
		this.errors[field].push(message)
		this.isValid = false
	}

	// Validation helper methods
	isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	isNumeric(value) {
		return !isNaN(parseFloat(value)) && isFinite(value)
	}

	// Get validation result
	passes() {
		if (!this.hasRun) {
			this.validate()
			this.hasRun = true
		}
		return this.isValid
	}

	fails() {
		return !this.passes()
	}

	getErrors() {
		return this.errors
	}

	getFirstError(field = null) {
		if (field) {
			return this.errors[field] ? this.errors[field][0] : null
		}

		const firstField = Object.keys(this.errors)[0]
		return firstField ? this.errors[firstField][0] : null
	}
}
