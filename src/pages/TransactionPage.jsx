import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import useAuth from "../hooks/useAuth";
import api from "../services/api";

export default function TransactionsPage() {
  const {tipo} = useParams();
  const [transfer, setTransfer] = useState({value: "",description: ""});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {auth} = useAuth();

  function setValue(e){
    setTransfer({...transfer, [e.target.name]: e.target.value});
  }

  function submitTransfer(e){
    e.preventDefault();
    setIsLoading(true);

    let value = Number(transfer.value.replace(/,/g, '.'));
    const body = {value: value, description: transfer.description};

    if(body.value <= 0){
      setIsLoading(false);
      alert("O valor deve ser positivo");
      return;
    }
    if(!validarNumeroFloat(body.value)){
      setIsLoading(false);
      alert("O valor deve ser flutuante (ex:40.5)");
      return;
    }

    const promise = api.createTransaction(tipo, body, auth);
    promise.then(() => {
      setIsLoading(false);
      navigate("/home");
    });
    promise.catch(err => {
      setIsLoading(false);
      alert(err.response.data);
    });
  }

  return (
    <TransactionsContainer>
      <h1>Nova {tipo}</h1>
      <form onSubmit={submitTransfer}>
        <input data-test="registry-amount-input"
          placeholder="Valor" 
          type="text"
          name="value"
          onChange={setValue}
          value={transfer.value}
          disabled={isLoading}
          required
        />
        <input data-test="registry-name-input"
          placeholder="Descrição" 
          type="text"
          name="description"
          onChange={setValue}
          value={transfer.description}
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading} data-test="registry-save">Salvar {tipo}</button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
function validarNumeroFloat(numero) {
  const floatNumber = parseFloat(numero);
  return Number.isFinite(floatNumber);
}