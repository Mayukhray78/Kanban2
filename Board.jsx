import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
    const [completed, setCompleted] = useState([]);
    const [incomplete, setIncomplete] = useState([]);
    const [backlog, setBacklog] = useState([]);
    const [inReview, setInReview] = useState([]);
    const [selectedMainOption, setSelectedMainOption] = useState(''); 
    const [selectedSubOption1, setSelectedSubOption1] = useState(''); 
    const [selectedSubOption2, setSelectedSubOption2] = useState(''); 

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/todos")
            .then((response) => response.json())
            .then((json) => {
                setCompleted(json.filter((task) => task.completed));
                setIncomplete(json.filter((task) => !task.completed));
            });
    }, []);

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || source.droppableId === destination.droppableId) return;

        deletePreviousState(source.droppableId, draggableId);

        const task = findItemById(draggableId, [...incomplete, ...completed, ...inReview, ...backlog]);

        setNewState(destination.droppableId, task);
    };

    const handleMainDropdownChange = (event) => {
        setSelectedMainOption(event.target.value); 
        setSelectedSubOption1(''); 
        setSelectedSubOption2('');
    };

    const handleSubDropdown1Change = (event) => {
        setSelectedSubOption1(event.target.value);
    };

    const handleSubDropdown2Change = (event) => {
        setSelectedSubOption2(event.target.value);
    };

    function deletePreviousState(sourceDroppableId, taskId) {
        switch (sourceDroppableId) {
            case "1":
                setIncomplete(removeItemById(taskId, incomplete));
                break;
            case "2":
                setCompleted(removeItemById(taskId, completed));
                break;
            case "3":
                setInReview(removeItemById(taskId, inReview));
                break;
            case "4":
                setBacklog(removeItemById(taskId, backlog));
                break;
        }
    }

    function setNewState(destinationDroppableId, task) {
        let updatedTask;
        switch (destinationDroppableId) {
            case "1":
                updatedTask = { ...task, completed: false };
                setIncomplete([updatedTask, ...incomplete]);
                break;
            case "2":
                updatedTask = { ...task, completed: true };
                setCompleted([updatedTask, ...completed]);
                break;
            case "3":
                updatedTask = { ...task, completed: false };
                setInReview([updatedTask, ...inReview]);
                break;
            case "4":
                updatedTask = { ...task, completed: false };
                setBacklog([updatedTask, ...backlog]);
                break;
        }
    }

    function findItemById(id, array) {
        return array.find((item) => item.id == id);
    }

    function removeItemById(id, array) {
        return array.filter((item) => item.id != id);
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
                {}
                <div style={{ marginRight: "auto" }}>
                    <label htmlFor="statusDropdown" style={{ marginRight: "10px" }}>   </label>
                    <select
                        id="statusDropdown"
                        value={selectedMainOption}
                        onChange={handleMainDropdownChange}
                    >
                        <option value="">Select Status</option>
                        <option value="P1">Display</option>
                        
                    </select>

                    {}
                    {selectedMainOption && (
                        <div style={{ marginTop: "10px" }}>
                            <label htmlFor="subDropdown1" style={{ marginRight: "10px" }}>Grouping </label>
                            <select
                                id="subDropdown1"
                                value={selectedSubOption1}
                                onChange={handleSubDropdown1Change}
                            >
                                <option value="">Status</option>
                                <option value="P1">P1</option>
                                <option value="Todo">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    )}

                    {}
                    {selectedSubOption1 && (
                        <div style={{ marginTop: "10px" }}>
                            <label htmlFor="subDropdown2" style={{ marginRight: "10px" }}>Ordering </label>
                            <select
                                id="subDropdown2"
                                value={selectedSubOption2}
                                onChange={handleSubDropdown2Change}
                            >
                                <option value="">Priority</option>
                                <option value="Low">No Priority</option>
                                <option value="Low">Urgent</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Title in the Center */}
                <h2 style={{ textAlign: "center", flexGrow: 1 }}></h2>
            </header>

            {}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    width: "1300px",
                    margin: "0 auto"
                }}
            >
                {selectedSubOption2 ? (
                    <>
                        {}
                        <Column title={"No Priority"} tasks={backlog} id={"5"} />
                        <Column title={"Urgent"} tasks={incomplete} id={"1"} />
                        <Column title={"High"} tasks={completed} id={"2"} />
                        <Column title={"Medium"} tasks={inReview} id={"3"} />
                        <Column title={"Low"} tasks={backlog} id={"4"} />
                    </>
                ) : (
                    <>
                        {}
                        
                        <Column title={"P1"} tasks={backlog} id={"5"} />
                        <Column title={"TO DO"} tasks={incomplete} id={"1"} />
                        <Column title={"In Progress"} tasks={completed} id={"2"} />
                        <Column title={"Done"} tasks={inReview} id={"3"} />
                        <Column title={"Cancelled"} tasks={backlog} id={"4"} />
                    </>
                )}
            </div>
        </DragDropContext>
    );
}


