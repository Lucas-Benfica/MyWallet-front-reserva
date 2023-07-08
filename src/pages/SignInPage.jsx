import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import { useEffect, useState } from "react"
import api from "../services/api"

export default function SignInPage() {
  //Variével de estado que vai controlar as informações dos inputs
  const [formLogin, setFormLogin] = useState({email: '', password: ''});
  const [isLoading, setIsLoading] = useState(false);
  const {auth, login} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(auth && auth.token){
      navigate("/home");
    }
  }, []);

  //Função para ir salvando as mudanças
  function setLogin(e){
    setFormLogin({...formLogin, [e.target.name]: e.target.value})
  }

  function submitLogin(e){
    e.preventDefault();

    setIsLoading(true);

    const promise = api.login({...formLogin});
    promise.then( res => {
      setIsLoading(false);
      login(response.data);
      navigate("/home");
    });
    promise.catch( err => {
      setIsLoading(false);
      console.log(err);
      //alert('Erro, tente novamente');
    });
}

  return (
    <SingInContainer>
      <form onSubmit={submitLogin}>
        <MyWalletLogo />
        <input
          type="email"
          placeholder="E-mail"
          name="email"
          onChange={setLogin}
          value={formLogin.email}
          disabled={isLoading}
          required
        />
        <input 
          placeholder="Senha"
          type="password"
          autocomplete="new-password" 
          name="password"
          onChange={setLogin}
          value={formLogin.password}
          disabled={isLoading}
          required  
        />
        <button type="submit" disabled={isLoading}>
          Entrar
        </button>
      </form>

      <Link >
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
