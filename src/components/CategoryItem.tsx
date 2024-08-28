function CategoryItem({
  category,
  icon,
  hoverColor
}: {
  category: string;
  icon: React.ReactNode;
  hoverColor: string
}) {
  return (
    <button className={`flex items-center bg-white text-black ${hoverColor} gap-1 border-2 rounded-full p-2`}>
      {icon} <p className="font-semibold mx-2">{category}</p>
    </button>
  );
}

export default CategoryItem;
