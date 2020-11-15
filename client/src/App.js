import React from 'react';

function App() {
    const imgSrc = "../../../../../Pictures/2x2.jpg";

    return (
        <div className="grid-container">
        <header className="row">
            <div>
                <a href="/" className="logo">arthub</a>
            </div>
            <div>
                <a href="#">Artists</a>
                <a href="#">Login</a>
            </div>
        </header>
        <main>
            <div className="row center">
                <div className="card">
                    <a href="#">
                        <img className="medium" src={imgSrc} alt="artist"/>
                    </a>
                    <div className="card-body">
                        <a href="">
                            <h2>Anike Nicole Dorgu</h2>
                        </a>
                        <div className="rating">
                            <span><i className="fa fa-star"></i></span>
                            <span><i className="fa fa-star"></i></span>
                            <span><i className="fa fa-star"></i></span>
                            <span><i className="fa fa-star"></i></span>
                            <span><i className="fa fa-star"></i></span>
                        </div>
                        <div className="location">Nigeria</div>
                    </div>
                </div>
            </div> 
        </main>
        <footer className="row center">
            <p>All rights reserved &copy; 2020</p>
        </footer>    
    </div>
    );
}

export default App;