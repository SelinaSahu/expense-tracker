import { useState } from "react";
import "./UserDetailForm.css";
import { v4 as uuidv4 } from "uuid";


export default function UserDetailForm({addNewDetail}) {
    let [formDetail, setFormDetail] = useState({
        username: "",
        currBalance: "",
        credited: "",
        debited: "",
        avBalance: "",
    });

    let handleInputChange = (event) => {
        setFormDetail((currDetail) => {
            return { ...currDetail, [event.target.name]: event.target.value };
        });
    };

    let handleSubmit = (event) => {
        event.preventDefault();
        let availableBalance = Number(formDetail.currBalance) + Number(formDetail.credited) - Number(formDetail.debited);
        
        
        let newUser = {
            id: uuidv4(),
            name: formDetail.username,
            currBalance: formDetail.currBalance,
            credited: formDetail.credited,
            debited: formDetail.debited,
            avBalance: availableBalance.toString(),
        };

        console.log(formDetail);
        console.log(newUser.id);
        addNewDetail(newUser)
        setFormDetail({
            username: "",
            currBalance: "",
            credited: "",
            debited: "",
            avBalance: "",
        });
    };

    return (
        <>
            <div className="UserDetailForm">
                <h3>Add your details here</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Enter your name here"
                        type="text"
                        required
                        id="username"
                        name="username"
                        value={formDetail.username}
                        onChange={handleInputChange}
                    />
                    <br /><br />

                    <input
                        placeholder="Enter current balance"
                        type="number"
                        required
                        id="currBalance"
                        name="currBalance"
                        value={formDetail.currBalance}
                        onChange={handleInputChange}
                    />
                    <br /><br />

                    <input
                        placeholder="Credit amount"
                        type="number"
                        id="credited"
                        name="credited"
                        value={formDetail.credited}
                        onChange={handleInputChange}
                    />
                    <br /><br />

                    <input
                        placeholder="Debit amount"
                        type="number"
                        id="debited"
                        name="debited"
                        value={formDetail.debited}
                        onChange={handleInputChange}
                    />
                    <br /><br />

                   {/* <input
                        placeholder="Available balance"
                        type="number"
                        id="avBalance"
                        name="avBalance"
                        value={formDetail.avBalance}
                        onChange={handleInputChange}
                    />
                    <br /><br /> */}

                    <button type="submit">Submit</button>
                </form>
                <hr />
            </div>
            <hr />
        </>
    );
}
