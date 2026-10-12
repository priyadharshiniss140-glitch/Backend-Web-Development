'use strict';
const recipes = new Map([['1', { id: '1', title: 'Sample recipe', coverUrl: null, coverPublicId: null }]]);
function findRecipeById(id) { return recipes.get(String(id)) || null; }
function saveRecipe(recipe) { recipes.set(String(recipe.id), recipe); return recipe; }
module.exports = { recipes, findRecipeById, saveRecipe };
