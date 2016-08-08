var Form=React.createClass({
    handleKeyPress:function(e){
        var code=e.nativeEvent.keyCode;
        var listArr=this.props.list;
        if(code==13){
            var content=$(e.target).val().trim();
            if(content==""){
                return;
            }
            listArr.push({"content":content,"isActive":true});
            this.props.newTodo(listArr);
            $(e.target).val("");
        }
    },
    render:function(){
        return(
            <div className="new-todoBox">
                <input className="new-todo" autofocus="" autocomplete="off" placeholder="What needs to be done?" onKeyPress={this.handleKeyPress}/>
            </div>
        )
    }
});

var Filter=React.createClass({
    handleFiltIsActive:function(e){
        if(e.target.nodeName==="A"){
            var thisEl=$(e.target);
            var value=thisEl.attr("href").slice(2);

            $(this.refs.filters).find("a").removeClass("selected");
            thisEl.addClass("selected");

            //console.log(value);
            this.props.changeType(value);
        }

    },
    handleClear:function(){
        var arr=this.props.list;
        var newArr=[];
        arr.map(function(list){
            if(list.isActive){
                newArr.push({"content":list.content,"isActive":true});
            }
        });
        this.props.clearComCallBack(newArr);
    },
    render:function(){
        var arr=this.props.list;
        var n=0;
        var countCompleted=0,countCompletedArr=[];
        for(var i=0;i<arr.length;i++){
            if(arr[i].isActive){++n;}
            if(!arr[i].isActive){++countCompleted;}
        }
       if(countCompleted>0){
           countCompletedArr.push(
               <button className="clear-completed" onClick={this.handleClear} key="btn">
                   Clear completed
               </button>
           );
       }

        return(
            <footer className="footer">
                <span className="todo-count">
                    <strong>{n}</strong> item left
                </span>
                <ul className="filters fn-clear" onClick={this.handleFiltIsActive} ref="filters">
                    <li><a href="#/all" className="selected">All</a></li>
                    <li><a href="#/active">Active</a></li>
                    <li><a href="#/completed">Completed</a></li>
                </ul>
                {countCompletedArr}
            </footer>
        )

    }
});

var List=React.createClass({
    handleChangeIsActive:function(e){
        var thisEl=$(e.target);
        var index=thisEl.parents("li").attr("data-index");
        var arr=this.props.list;
        if(thisEl.get(0).checked){
            thisEl.next().addClass("line");
            arr[index].isActive=false;
        }else{
            thisEl.next().removeClass("line");
            arr[index].isActive=true;
        }
        this.props.changeIsActive(arr);
    },
    handleAllChangeIsActive:function(e){
        var arr=this.props.list,newArr=[];
        if($(e.target).get(0).checked){
            //全部变成completed
            $(this.refs.toListBox).find("label").addClass("line");
            $(this.refs.toListBox).find("input[type='checkbox']").attr("checked", true);
            for(var i=0;i<arr.length;i++){
                newArr.push({
                    "content":arr[i].content,
                    "isActive":false
                })
            }

        }else{
            $(this.refs.toListBox).find("label").removeClass("line");
            $(this.refs.toListBox).find("input[type='checkbox']").attr("checked", false);
            for(var i=0;i<arr.length;i++){
                newArr.push({
                    "content":arr[i].content,
                    "isActive":true
                })
            }
        }
        this.props.changeAllComCallBack(newArr);
    },
    handleDel:function(e){
        var arr=this.props.list;
        var index=$(e.target).attr("data-index");
        var listArr=arr.slice(0,index).concat(arr.slice(index+1,arr.length));
        this.props.del(listArr);
    },
    render:function(){
        var listArr=[],arr=this.props.list;
        var self=this;
        var type=this.props.type;
        if(type==="all"){
            arr.map(function(list,index){
                if(!list.isActive){
                    listArr.push(
                        <li className="todo" key={index} data-index={index}>
                            <div className="view">
                                <input className="toggle" type="checkbox" onChange={self.handleChangeIsActive}/>
                                <label className="content line">{list.content}</label>
                                <button className="destroy fn-hide" onClick={self.handleDel} data-index={index}>X</button>
                            </div>
                            <input className="edit fn-hide" type="text"/>
                        </li>
                    );
                }else{
                    listArr.push(
                        <li className="todo" key={index} data-index={index}>
                            <div className="view">
                                <input className="toggle" type="checkbox" onChange={self.handleChangeIsActive}/>
                                <label className="content">{list.content}</label>
                                <button className="destroy fn-hide" onClick={self.handleDel} data-index={index}>X</button>
                            </div>
                            <input className="edit fn-hide" type="text"/>
                        </li>
                    );
                }

            });
        }else if(type==="active"){
            arr.map(function(list,index){
                if(!list.isActive){
                    return;
                }
                listArr.push(
                    <li className="todo" key={index} data-index={index}>
                        <div className="view">
                            <input className="toggle" type="checkbox" onChange={self.handleChangeIsActive}/>
                            <label className="content">{list.content}</label>
                            <button className="destroy fn-hide" onClick={self.handleDel} data-index={index}>X</button>
                        </div>
                        <input className="edit fn-hide" type="text"/>
                    </li>
                );
            });
        }else if(type==="completed"){
            arr.map(function(list,index){
                if(list.isActive){
                    return;
                }
                listArr.push(
                    <li className="todo" key={index} data-index={index}>
                        <div className="view">
                            <input className="toggle" type="checkbox" onChange={self.handleChangeIsActive}/>
                            <label className="content line">{list.content}</label>
                            <button className="destroy fn-hide" onClick={self.handleDel} data-index={index}>X</button>
                        </div>
                        <input className="edit fn-hide" type="text"/>
                    </li>
                );
            });
        }

        return(
            <div>
                <input className="toggle-all" type="checkbox" onChange={this.handleAllChangeIsActive} changeAllComCallBack={this.props.changeAllComCallBack}/>
                <ul className="listBox" ref="toListBox">
                    {listArr}
                </ul>
                <Filter list={this.props.list} changeType={this.props.changeType} clearComCallBack={this.props.clearComCallBack}/>
            </div>
        )

    }
});

var App=React.createClass({
    getInitialState:function(){
        return{
            arr:[],
            type:"all"
        }
    },
    changeArrCallback:function(arr){
        this.setState({arr:arr});
    },
    changeTypeCallback:function(text){
        //console.log(this.state.type);
        this.setState({type:text});

    },
    render:function(){
        return(
            <div>
                <h1 className="header">todos</h1>
                <Form newTodo={this.changeArrCallback} list={this.state.arr}/>
                <List list={this.state.arr} newTodo={this.changeArrCallback} del={this.changeArrCallback} changeIsActive={this.changeArrCallback} type={this.state.type} changeType={this.changeTypeCallback} clearComCallBack={this.changeArrCallback} changeAllComCallBack={this.changeArrCallback}/>
            </div>
        )
    }
});

ReactDOM.render(<App/>,document.getElementById("container"));


