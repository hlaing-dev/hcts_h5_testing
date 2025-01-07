import { Link } from "react-router-dom";

const Header = ({
  categories,
  onCategoryClick,
  selectedCategory,
  darkmode,
}: any) => {
  return (
    <div className="flex gap-6 noti-header items-center p-5">
      <Link to="/profile">
        {darkmode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.828 10.9999H20V12.9999H7.828L13.192 18.3639L11.778 19.7779L4 11.9999L11.778 4.22192L13.192 5.63592L7.828 10.9999Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.828 10.9999H20V12.9999H7.828L13.192 18.3639L11.778 19.7779L4 11.9999L11.778 4.22192L13.192 5.63592L7.828 10.9999Z"
              fill="#080808"
            />
          </svg>
        )}
      </Link>

      {categories.map((category: any) => (
        <div
          key={category.id}
          style={{ cursor: "pointer" }}
          className={selectedCategory === category.id ? "act" : ""}
          onClick={() => onCategoryClick(category.id)}
        >
          <p className={`${!darkmode ? "text-black" : "text-white"}`}>{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Header;
