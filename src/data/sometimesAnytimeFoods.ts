export type EffectIcon = "grades" | "books" | "immunity" | "tooth" | "badheart" | "sugar";

export interface FoodEffect {
  icon: EffectIcon;
  text: string;
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: "sometimes" | "anytime";
  hint?: string;
  benefit?: FoodEffect;
  nonBenefit?: FoodEffect;
}

export const MODE1_FOODS: FoodItem[] = [
  { id: "cookie", name: "Cookie", emoji: "🍪", category: "sometimes" },
  { id: "apple", name: "Apple", emoji: "🍎", category: "anytime" },
  { id: "banana", name: "Banana", emoji: "🍌", category: "anytime" },
  { id: "chocolate", name: "Chocolate", emoji: "🍫", category: "sometimes" },
  { id: "broccoli", name: "Broccoli", emoji: "🥦", category: "anytime" },
];

export const MODE2_FOODS: FoodItem[] = [
  {
    id: "fries",
    name: "French Fries",
    emoji: "🍟",
    category: "sometimes",
    hint: "High in fat & sodium — save it for special days!",
    nonBenefit: { icon: "badheart", text: "Too much fat is bad for your heart!" },
  },
  {
    id: "cookie",
    name: "Cookie",
    emoji: "🍪",
    category: "sometimes",
    hint: "High in added sugar — enjoy occasionally!",
    nonBenefit: { icon: "tooth", text: "Too much sugar harms your teeth!" },
  },
  {
    id: "chocolate",
    name: "Chocolate",
    emoji: "🍫",
    category: "sometimes",
    hint: "High in sugar & fat — a treat, not everyday!",
    nonBenefit: { icon: "sugar", text: "High sugar spikes your energy & crashes it!" },
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    category: "anytime",
    hint: "Packed with fibre & vitamins!",
    benefit: { icon: "books", text: "Helps focus in class" },
  },
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    category: "anytime",
    hint: "Great source of energy & potassium!",
    benefit: { icon: "grades", text: "Helps get better grades" },
  },
  {
    id: "broccoli",
    name: "Broccoli",
    emoji: "🥦",
    category: "anytime",
    hint: "Packed with vitamins & fibre!",
    benefit: { icon: "immunity", text: "Boosts your immunity" },
  },
];
