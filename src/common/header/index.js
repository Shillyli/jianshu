import React,{ Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionCreators } from './store';
import { actionCreators as loginActionCreators } from '../../pages/login/store';
import {
	HeaderWrapper,
	Logo,
	Nav,
	NavItem,
  SearchInfo,
  SearchInfoTitle,
  SearchInfoSwitch,
  SearchInfoList,
  SearchInfoItem,
	SearchWrapper,
	NavSearch,
	Addition,
	Button
} from './style.js';

class Header extends Component{

  getListArea(){
    const { focused, list, mouseIn, page, totalPage, handleMouseEnter,handleMouseLeave,handlePageClick } = this.props;
    const jsList = list.toJS();
    const pageList = [];
    if(jsList.length){
      for (let i = (page-1)*10;i < page*10; i++) {
        console.log(jsList[i]);
        pageList.push(
           <SearchInfoItem key={ jsList[i] }>{ jsList[i] }</SearchInfoItem>
          )
      }
    }
    if(focused || mouseIn){
      return(
       <SearchInfo 
          onMouseEnter = { handleMouseEnter }
          onMouseLeave = { handleMouseLeave }
       >
          <SearchInfoTitle>
            热门搜索
            <SearchInfoSwitch onClick = {() => handlePageClick(page,totalPage,this.spinIcon) }>
            <i ref={(icon) => {this.spinIcon = icon }} className=" iconfont spin ">&#xe851;</i>
              换一批
            </SearchInfoSwitch>
          </SearchInfoTitle>
          <SearchInfoList>
         { pageList }
          </SearchInfoList>
        </SearchInfo>
        )
    }
    else {
      return null;
    }
  }

  render(){
    const { focused, login, handleInputFocus, handleInputBlur, list, handleOut } = this.props;
    return(
    	<HeaderWrapper>
        <Link to="/">
          <Logo />
        </Link>
        <Nav>
           <NavItem className='left active'>首页</NavItem>
           <NavItem className='left'>下载APP</NavItem>
           <NavItem className='right'>
              <i className="iconfont">&#xe636;</i>
           </NavItem>
          {
            login ?
            <NavItem className='right' onClick={ handleOut }>退出</NavItem> :
            <Link to="/login"><NavItem className='right'>登陆</NavItem></Link>
          }
           <SearchWrapper>
             <CSSTransition
                in={focused}
                timeout={200}
                classNames="slide"
             >
               <NavSearch
                  className={focused ? 'focused':''}
                  onFocus={() => handleInputFocus(list)}
                  onBlur={handleInputBlur}
               ></NavSearch>
             </CSSTransition>
             <i className={focused ? 'focused iconfont zoom':'iconfont zoom'}>
             &#xe69d;
             </i>
             { this.getListArea() }
           </SearchWrapper>
        </Nav>
         <Addition>
          <Link to='/write'>
           	<Button className='writing'><i className="iconfont">&#xe62a;</i>写文章</Button>
          </Link>
            <Button className='reg'>注册</Button>
         </Addition>
    	</HeaderWrapper>
  		)
  	}
}

const mapStateToProps = (state) => {
    return {
      focused: state.getIn(['header','focused']),
      list:state.getIn(['header','list']),
      mouseIn:state.getIn(['header','mouseIn']),
      totalPage:state.getIn(['header','totalPage']),
      page:state.getIn(['header','page']),
      login: state.getIn(['login','login'])
    }
};
const mapDispatchToProps =(dispatch) => {
     return {
         handleInputFocus(list){
          (list.size === 0) && dispatch(actionCreators.getList());
          dispatch(actionCreators.searchFocus());
         },

         handleInputBlur(){
          dispatch(actionCreators.searchBlur());
         },

         handleMouseEnter(){
          dispatch(actionCreators.mouseEnter());
         },

         handleMouseLeave(){
          dispatch(actionCreators.mouseLeave());
         },

         handlePageClick(page,totalPage,spin){
          let originAngle = spin.style.transform.replace(/[^0-9]/ig,'');
          if(originAngle){
            originAngle = parseInt(originAngle,10);
          }else{
            originAngle = 0;
          }
          spin.style.transform = 'rotate('+ (originAngle + 360)+'deg)';
          if( page < totalPage ){
          dispatch(actionCreators.changePage( page+1 ));
         }
         else{
          dispatch(actionCreators.changePage( 1 ));
         }
        },
         handleOut(){
          dispatch(loginActionCreators.handleOut());
        }
     }
};

export default connect(mapStateToProps,mapDispatchToProps)(Header);