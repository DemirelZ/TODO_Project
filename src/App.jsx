import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ListItem from "./componenet/ListItem";
import Loading from "./componenet/Loading";
import { v4 as generatePass } from "uuid";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

// axios'un yapıcağı isteklerde temel url'i belirleme
axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const [todos, setTodos] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalCount, setTotalCount] = useState();

  const options = {
    params: {
      _limit: 5,
      _page: page,
    },
  };
  // bileşen ekrana basılınca
  useEffect(() => {
    // veritabaının verileri alma
    axios
      .get("http://localhost:3000/todos", options)
      .then((res) => {
        // api'dekş toplam eleman sayısına erişme
        const itemCount = Number(res.headers["x-total-count"]);

        // toplam sayfa sayısını hesaplama
        const max = Math.ceil(itemCount / options.params._limit);
        setTotalPage(max);
        setTotalCount(itemCount);

        setTodos(res["data"]);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          alert("Your connection timed out. Try again.");
        }
      });
  }, [page]);

  // fformun gönderilmesi
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTodo = {
      id: generatePass(),
      title: e.target[0].value,
      date: new Date(),
      isDone: false,
    };

    if (!e.target[0].value) {
      alert("Please do not leave it blank");
      return;
    }

    // veritabanaına yeni eleman ekleme
    // göndermek isteğimiz url + gönderilecek veri
    axios.post("/todos", newTodo).then(() => {
      if (todos.length === options.params._limit) {
        // son syatfa yer yoksa son sayfanın bir fazlasına
        // varsa son sayfay yönlendiir
        setPage(
          totalCount % options.params._limit === 0 ? totalPage + 1 : totalPage
        );

        if (page === totalPage) {
          // Eğer son sayfadaysa otomatik olarak bir sonraki sayfaya geç
          setPage(totalPage + 1);
        } else {
          setPage(page);
        }
      } else {
        setTodos([...todos, newTodo]);
      }
    });

    e.target[0].value = "";
  };

  const goEndPage = () => {
    setPage(totalPage);
  };

  const goFirstPage = () => {
    setPage(1);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center">Create your TO-DO list</h2>

      <form
        onSubmit={handleSubmit}
        className="d-flex justify-content-center gap-3 my-5"
      >
        <input className="form-control shadow" type="text" />
        <button className="btn btn-primary shadow">Save</button>
      </form>

      <ul className="list-group">
        {/* api'dan cevap beklerken: */}
        {todos === null && <Loading />}

        {/* api'dan veri geldikten sonra: */}
        {todos?.map((todo) => (
          <ListItem
            todo={todo}
            allTodos={todos}
            setTodos={setTodos}
            setPage={setPage}
            totalPage={totalPage}
            key={todo.id}
          />
        ))}
      </ul>

      {/* pagination */}
      <div className="d-flex justify-content-between align-items-center mt-5">
        <button disabled={page === 1} onClick={goFirstPage}>
          {" "}
          {page === 1 ? "First Page" : "Go to the First Page"}
        </button>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="d-flex justify-content-center align-items-center fs-4"
        >
          <AiOutlineLeft />
        </button>

        <p className="fs-4 fw-bold">{page}</p>

        <button
          disabled={page === totalPage}
          onClick={() => setPage(page + 1)}
          className="d-flex justify-content-center align-items-center fs-4"
        >
          <AiOutlineRight />
        </button>

        <button disabled={page === totalPage} onClick={goEndPage}>
          {" "}
          {page === totalPage ? "Last page" : "Go to the last page"}
        </button>
      </div>
    </div>
  );
}

export default App;
