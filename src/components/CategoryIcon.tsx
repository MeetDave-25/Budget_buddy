import { Utensils, Home, Train, Gamepad2, ShoppingBag, Book, Coffee, Heart, Smartphone, MoreHorizontal } from 'lucide-react';

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className = "w-5 h-5" }: CategoryIconProps) {
  const icons: Record<string, any> = {
    Food: Utensils,
    Rent: Home,
    Travel: Train,
    Entertainment: Gamepad2,
    Shopping: ShoppingBag,
    Education: Book,
    Coffee: Coffee,
    Health: Heart,
    Phone: Smartphone,
    Other: MoreHorizontal,
  };

  const Icon = icons[category] || MoreHorizontal;
  return <Icon className={className} />;
}
