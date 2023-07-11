import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useEffect, useState } from "react"
import api from "../services/api";
import useAuth from "../hooks/useAuth.js"
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [user, setUser] = useState();
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const {auth, login} = useAuth();

  useEffect(() => {
    const promise = api.getHistory(auth);
    promise.then(res => {
      setUser(res.data.name);
      setList(res.data.list);
      setTotal(calcTotal(res.data.list));
    });
    promise.catch(err => {
      alert(err.response.data);
    });
  }, []);

  function calcTotal(ls){
    let soma = 0;
    for(let i=0; i < ls.length; i++){
      if(ls[i].type == "entrada"){
        soma += Number(ls[i].value);
      }
      else{
        soma -= Number(ls[i].value);
      }
    }
    return soma;
  }
  
  function exit(){
    const promise = api.logout(auth);
    promise.then(res => {
      login("exit");
      navigate("/");
    });
    promise.catch(err => {
      alert(err.response.data);
    })
  }
  
  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name" >Olá, {user}</h1>
        <BiExit onClick={exit} data-test="logout"/>
      </Header>

      <TransactionsContainer>
        <StyledUL>
          {list.map(transaction => <Transaction key={transaction._id} transaction = {transaction} />)}
        </StyledUL>

        <article>
          <strong>Saldo</strong>
          <Value color={(total >= 0)?"positivo":"negativo"}  data-test="total-amount">
            {(total >= 0) 
              ? total.toFixed(2).toString().replace(".", ",")
              : ((total * (-1)).toFixed(2)).toString().replace(".", ",")}
          </Value>
        </article>
      </TransactionsContainer>


      <ButtonsContainer>
        <button onClick={() => navigate("/nova-transacao/entrada")} data-test="new-income" >
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </button>
        <button onClick={() => navigate("/nova-transacao/saida")} data-test="new-expense" >
          <AiOutlineMinusCircle />
          <p>Nova <br />saída</p>
        </button>
      </ButtonsContainer>

    </HomeContainer>
  )
}

function Transaction({transaction}){
  const {date, description, type, value} = transaction;
  const day = dayjs(date).format("DD/MM");
  const value2 = Number(value).toFixed(2);
  let value3 = value2.toString().replace(".", ",");
  return (
    <ListItemContainer>
            <div>
              <span>{day}</span>
              <strong  data-test="registry-name" >{description}</strong>
            </div>
            <Value  data-test="registry-amount" color={(type == "entrada") ? "positivo" : "negativo"}>{value3}</Value>
    </ListItemContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`
const StyledUL = styled.ul`
  overflow: auto;
  height: 446px;
`