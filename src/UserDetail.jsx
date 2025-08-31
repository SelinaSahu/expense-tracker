import { useState, useEffect } from "react";
import UserDetailForm from "./UserDetailForm";

export default function UserDetail() {
    let [detail, setDetail] = useState(() => {
        let storedData = localStorage.getItem("userDetail");
        return storedData ? JSON.parse(storedData) : [
            {
                name: "Selina",
                currBalance: "0",
                credited: "0",
                debited: "0",
                avBalance: "0",
            }
        ];
    });
      
    let [userToEdit, setUserToEdit] = useState(null); 
    // Update localStorage whenever 'detail' changes

    useEffect(() => {
        localStorage.setItem("userDetail", JSON.stringify(detail));
    }, [detail]);

    let addNewDetail = (user) => {
        setDetail((currDetails) => [...currDetails, user]);
    };
    
    let updateUser = (id) => {
        let userToUpdate = detail.find((user) => user.id === id);
        setUserToEdit(userToUpdate);
    };

    let deleteUser = (id) => {
        setDetail((currDetails) => currDetails.filter((user) => user.id != id));
    };

    return (
        <>
            <UserDetailForm addNewDetail={addNewDetail} />
            <div>
                <h3>All User Details</h3>
                {detail.map((user, index) => (
                    <div key={index} style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Current Balance:</strong> {user.currBalance}</p>
                        <p><strong>Credited:</strong> {user.credited}</p>
                        <p><strong>Debited:</strong> {user.debited}</p>
                        <p><strong>Available Balance:</strong> {user.avBalance}</p>
                        <button onClick={() => updateUser(user.id)}>Update</button>&nbsp;&nbsp;
                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </>
    );
}
