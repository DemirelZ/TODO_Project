import axios from "axios";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

// axios'un yapıcağı isteklerde temel url'i belirleme
axios.defaults.baseURL = "http://localhost:3000";

const ListItem = ({ todo, allTodos, setTodos, totalPage, setPage }) => {
  const [isEdit, setIsEdit] = useState(false);

  // elemanı hem api'dan hem ekran siler
  const handleDelete = () => {
    // api'dan veriyi silme
    axios
      .delete(`/todos/${todo.id}`)
      // api'dan silinirse arayüzü güncelle(state'den silme)
      .then(() => {
        const filtred = allTodos.filter((i) => i.id !== todo.id);
        setTodos(filtred);

        console.log(allTodos);
        
          if(allTodos.length === 1){
            setPage(totalPage-1)
          }
        






      })
      // hata olursa kullanıcya bildirme
      .catch((err) => alert("Veriyi alırken bir hata oluştu.."));
  };

  const handleChange = () => {
    const updated = { ...todo, isDone: !todo.isDone };

    axios.put(`/todos/${todo.id}`, updated).then(() => {
      const newTodos = allTodos.map((i) => (i.id === updated.id ? updated : i));

      setTodos(newTodos);
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const updated = {...todo, title: e.target[0].value}

    axios.put(`/todos/${todo.id}`, updated)
    .then(()=>{
      const newAllTodos = allTodos.map((i)=> i.id === updated.id ? updated : i )

      setTodos(newAllTodos)

      setIsEdit(false)
    })


  }

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex gap-1">
        <input
          className="form-check-input"
          checked={todo.isDone}
          onChange={handleChange}
          type="checkbox"
        />
        <span>{todo.isDone ? "Completed" : "Ongoing"}</span>
      </div>

      {isEdit ? (
        <form onSubmit={handleEdit} className="d-flex align-items-center gap-1">
          <input className="rounded" defaultValue={todo.title} type="text" />
          <button>
            <AiOutlineCheck />
          </button>
          <button type="button" onClick={()=> setIsEdit(false)}>
            <AiOutlineClose />
          </button>
        </form>
      ) : (
        <span>{todo.title}</span>
      )}

      {isEdit ? (
        <span></span>
      ) : (
        <div className="d-flex align-items-center gap-1">
          <button onClick={() => setIsEdit(true)}>Edit</button>
          <button className="bg-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </li>
  );
};

export default ListItem;
