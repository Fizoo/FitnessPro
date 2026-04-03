import { readFileSync, writeFileSync } from 'fs';

const exercises = JSON.parse(readFileSync('./data/exercises.json', 'utf-8'));

const grouped = {};

for (const ex of exercises) {
  const bodyPart = ex.bodyPart;

  if (!grouped[bodyPart]) {
    grouped[bodyPart] = [];
  }

  grouped[bodyPart].push({
    id: ex.id,
    name: ex.name,
    gifUrl: '',
    bodyPart: ex.bodyPart,
    target: ex.target,
    equipment: ex.equipment,
    secondaryMuscles: ex.secondaryMuscles,
    instructions: ex.instructions,
    description: ex.description || '',
    difficulty: ex.difficulty || 'beginner',
    category: ex.category || 'strength',
    isFavorite:false,
    personalRecord: null,
    history: []


  });
}

const result = Object.entries(grouped).map(([bodyPart, data], index) => ({
  id: index,
  params: bodyPart.toLowerCase().replace(' ', '-'),
  name: bodyPart,
  exerciseCount: data.length,
  imageUrl: `assets/img/${bodyPart.toLowerCase().replace(' ', '-')}.png`,
  data
}));

writeFileSync('./data/exercises-grouped.json', JSON.stringify(result, null, 2));
console.log(`✅ Готово! ${result.length} груп, ${exercises.length} вправ`);
