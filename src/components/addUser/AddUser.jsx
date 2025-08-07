import "./addUser.css";

const AddUser = () => {
  return (
    <>
      <div className="addUser">
        <form>
          <input type="text" name="username" placeholder="Username" />
          <button>Search</button>
        </form>
        <div className="user">
          <div className="user-detail">
          <img src="/avatar.png" alt="Avatar" />
          <span className="username">Karam Jyoti</span>
        </div>
          <button>Add User</button>
        </div>
      </div>
    </>
  );
};

export default AddUser;
