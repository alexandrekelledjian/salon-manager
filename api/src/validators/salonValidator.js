const Joi = require('joi');

const codeUrlPattern = /^[A-Z0-9_]+$/;

const createSalonSchema = Joi.object({
    code_url: Joi.string()
      .pattern(codeUrlPattern)
      .min(3)
      .max(100)
      .required()
      .messages({
              'string.pattern.base': 'code_url doit contenir uniquement des majuscules, chiffres et underscores',
              'string.min': 'code_url doit avoir au moins 3 caractères',
              'string.max': 'code_url doit avoir au maximum 100 caractères',
              'any.required': 'code_url est requis',
      }),
    nom: Joi.string().min(1).max(255).required().messages({
          'string.empty': 'nom est requis',
          'any.required': 'nom est requis',
    }),
    email: Joi.string().email().allow(null, '').optional(),
    telephone: Joi.string().max(50).allow(null, '').optional(),
    adresse: Joi.string().allow(null, '').optional(),
    logo_url: Joi.string().uri().allow(null, '').optional(),
    actif: Joi.boolean().optional(),
});

const updateSalonSchema = Joi.object({
    code_url: Joi.string()
      .pattern(codeUrlPattern)
      .min(3)
      .max(100)
      .optional()
      .messages({
              'string.pattern.base': 'code_url doit contenir uniquement des majuscules, chiffres et underscores',
      }),
    nom: Joi.string().min(1).max(255).optional(),
    email: Joi.string().email().allow(null, '').optional(),
    telephone: Joi.string().max(50).allow(null, '').optional(),
    adresse: Joi.string().allow(null, '').optional(),
    logo_url: Joi.string().uri().allow(null, '').optional(),
    actif: Joi.boolean().optional(),
}).min(1);

const validateCreate = (data) => createSalonSchema.validate(data);
const validateUpdate = (data) => updateSalonSchema.validate(data);

module.exports = { validateCreate, validateUpdate };
