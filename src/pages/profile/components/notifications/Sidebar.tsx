const Sidebar = ({ notices, onNoticeClick, selectedNotice ,darkmode}: any) => {
  return (
    <div className={`sidebar ${darkmode ? "bg-white/10" : "bg-white"} rounded-r-lg pb-10 p-1`}>
      {notices.map((notice: any) => (
        <button
          key={notice.id}
          className={`${darkmode ? "sidebar-button_dark" : "sidebar-button"} ${
            selectedNotice === notice.id ? "active" : ""
          }`}
          onClick={() => onNoticeClick(notice.id)}
        >
          {notice.title}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
