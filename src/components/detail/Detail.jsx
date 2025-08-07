import "./detail.css";

const Detail = () => {
  return (
    <div className="detail">
      <div className="user">
        <img src="./avatar.png" alt="User avatar" />
        <h2>Smith</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="Toggle chat settings" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="Toggle privacy & help" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg"
                  alt="Privacy photo"
                />
                <span>Photo_2021_png</span>
              </div>
               <img src="./download.png" alt="Download icon" className="icon" />
            </div>


             <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg"
                  alt="Privacy photo"
                />
                <span>Photo_2021_png</span>
              </div>
               <img src="./download.png" alt="Download icon" className="icon"/>
            </div>


             <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg"
                  alt="Privacy photo"
                />
                <span>Photo_2021_png</span>
              </div>
               <img src="./download.png" alt="Download icon"  className="icon"/>
            </div>

             <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg"
                  alt="Privacy photo"
                />
                <span>Photo_2021_png</span>
              </div>
               <img src="./download.png" alt="Download icon" className="icon" />
            </div>

             <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg"
                  alt="Privacy photo"
                />
                <span>Photo_2021_png</span>
              </div>
               <img src="./download.png" alt="Download icon"  className="icon"/>
            </div>



           
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared files</span>
            <img src="./arrowDown.png" alt="Toggle shared files" />
          </div>
        </div>

        <button>Block User</button>
        <button className="logout">Logout</button>
      </div>
    </div>
  );
};

export default Detail;
