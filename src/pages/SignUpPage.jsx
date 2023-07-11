import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import api from "../services/api";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formCadastro, setFormCadastro] = useState({name: "", email: "", password : "", confirmPass : ""});
  const [isLoading, setIsLoading] = useState(false);

  function setCadastro(e){
    setFormCadastro({...formCadastro, [e.target.name]: e.target.value})
  }

  function submitCadastro(e){
    e.preventDefault();
    setIsLoading(true);

    if(formCadastro.password != formCadastro.confirmPass){
      alert("As senhas estão diferentes!");
      setFormCadastro({...formCadastro, confirmPass: ""});
      setIsLoading(false);
      return;
    }

    const promise = api.singUp({
      name: formCadastro.name,
      email: formCadastro.email,
      password: formCadastro.password
    });

    promise.then(() => {
      setIsLoading(false);
      navigate("/");
    });

    promise.catch((err) => {
      alert(err.response.data);
      setIsLoading(false);
    });

  }

  return (
    <SingUpContainer>
      <form onSubmit={submitCadastro}>
        <MyWalletLogo />
        <input data-test="name"
          placeholder="Nome" 
          type="text"
          name="name"
          onChange={setCadastro}
          value={formCadastro.name}
          disabled={isLoading}
          required
        />
        <input data-test="email"
          type="email"
          placeholder="E-mail"
          name="email"
          onChange={setCadastro}
          value={formCadastro.email}
          disabled={isLoading}
          required
        />
        <input data-test="password"
          placeholder="Senha"
          type="password"
          name="password"
          onChange={setCadastro}
          value={formCadastro.password}
          disabled={isLoading}
          required  
        />
        <input data-test="conf-password"
          placeholder="Confirme a senha"
          type="password"
          name="confirmPass"
          onChange={setCadastro}
          value={formCadastro.confirmPass}
          disabled={isLoading}
          required  
        />
        <button data-test="sign-up-submit" type="submit" disabled={isLoading}>Cadastrar</button>
      </form>

      <Link to="/">
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
