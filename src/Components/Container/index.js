import{Nav} from '@fluentui/react';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

import { Header } from '../Header';
import { Carro } from '../../Containers/carro';

import './container.css'
export const ContainerMain = () =>{
    const handleNavClick = () => {

    }
    return(
        <div className= "container">
            <Header />
            <Nav
                onLinkClick={handleNavClick}
                selectedKey="key3"
                ariaLabel="Nav basic example"
                styles={{
                    root:{
                        width:210,
                        height:'100%',
                        boxSizing:'border-box',
                        border:'1px solid #eee',
                        overflow:'auto',
                    },
                }}
                groups={[{
                    links:[{
                        name:'Carros',
                        url:'/carros',
                        icon:'UserFollowed',
                        key:'carrosNav',
                    },
                    {
                        name:'Modelos',
                        url:'/modelos',
                        icon:'News',
                        key:'ModelosNav',

                    },{
                        name:'Usuarios',
                        url:'/Usuarios',
                        icon:'News',
                        key:'UsuariosNav',

                    },]
                }]}
            
            
            />

            <Router>
                <Switch>
                    <Route  path="/carros" component={Carro}/>
                    <Route  path="/modelos" component={()=><span> componentes</span>}/>


                    <Route  path="/usuarios" component={()=><span> componentes</span>}/>

                </Switch>
            </Router>
        </div>
    )
}