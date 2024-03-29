import { useState,useEffect } from "react";
import Alert from './components/Alert';
import './App.css';
import Todo from "./components/Todo";
import image from './todo_img.png';

// To store data and avoid data loss during page refresh  
const getLocalStorage = ()=>{
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'));
  }else{
    return [];
  }
}

function App(){
  const[name,setName] = useState('');
  const[list,setList] = useState(getLocalStorage());
  const[isEditing,setIsEditing] = useState(false);
  const [editId,setEditId] = useState(null);
  const[alert,setAlert] = useState({
    show: false,
    msg:'',
    type:''
  });
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!name){
      showAlert(true,'danger','please Enter Value');
    }else if(name && isEditing){
      // Check if there is something in value and if editing is true
      setList(
        list.map((item)=>{
          if(item.id === editId){
            return {...item,title: name};
          }
          return item;
        })
      );
      setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true,'success','value changed');
    }else{
      showAlert(true,'success','new task added');
      const newItem = {
        id: new Date().getTime().toString(),
        title: name,
      };
      setList([...list,newItem]);
      setName("");
    }
  };
    const showAlert = (show=false, type="",msg="")=>{
      // Default parameters
      setAlert({show,type,msg});
    };
    const clearList = ()=>{
      showAlert(true,'danger','empty list');
      setList([]);
    };
    const removeItem = (id)=>{
      showAlert(true,'danger',"task removed");
      setList(list.filter((item)=>item.id!== id));
    };
    const editItem = (id)=>{
      const specificItem = list.find((item)=>item.id === id);
      setIsEditing(true);
      setEditId(id);
      setName(specificItem.title);
    };
    useEffect(()=>{
      localStorage.setItem('list',JSON.stringify(list));
    },[list]);


  return(
    <>
    <div>
      <section className="section-center">
        <form className="todo-form" onSubmit={handleSubmit}>
          {alert.show &&(
            <Alert {...alert} removeAlert= {showAlert} list={list}/>
          )}{''}
         {/* inside of alert component pass all the properties from state alert value */}
          {/* show some checking for the proprety of show more specific for the value and if that is the case - display it // you can check it if you change useState for alert to show:true // The logical AND (&&) operator for a set of boolean operands will be true if and only if all the operands are true. Otherwise it will be false. */}
        <div className="form-control">
          <input
          type="text"
          className="todo"
          placeholder="Add task"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Edit" :"Add"}{''}
            {/* check if is editing and if is true than display edit, if not - submit (by default is false).  You can check it if you change useState for isEditing to true*/}
          </button>
        </div>
        </form>
        {list.length > 0 &&(
          <div className="todo-container">
            <Todo items={list} removeItem={removeItem} editItem={editItem}/>{''}
            {/* list as a prop into Todo component named 'items' */}
            <button className="clear-btn" onClick={clearList}>
              clear items
            </button>
          </div>
        )}
        <div className="img-container">
          <img src={image} className="image" alt="todo"></img>
        </div>
      </section>
    </div>
    </>
  )
}
export default App;