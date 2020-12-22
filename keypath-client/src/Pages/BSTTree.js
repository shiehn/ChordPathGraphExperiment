import React from 'react';
import axios from 'axios';
import Tree from 'react-d3-tree';

const containerStyles = {
    'width': '100%',
    'height': '80vh',
}

export class BSTTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined,
            tree: [{
                name: '100',
                children: []}
                ],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createNewNode = (val) => {
        return {
            name: val.toString(),
            children: [],
            attributes: {
            },
            left: undefined,
            right: undefined,
        }
    }

    cloneTree = (root) => {
        if (root == null) {
            return null;
        }

        let newNode = this.createNewNode(root.value);
        newNode.left = this.cloneTree(root.left);
        let c1 = this.cloneTree(root.left);
        let index =0;
        if(c1) {
            newNode.children[index] = c1
            index++;
        }
        newNode.right = this.cloneTree(root.right);
        let c2 = this.cloneTree(root.right);
        if(c2){
            newNode.children[index] = c2
        }

        return  newNode;
    }

    // bfTraveral = (node) => {
    //     console.log(node)
    //
    //     let queue = []
    //     queue.push(node)
    //
    //     while (queue.length > 0){
    //         let curNode = queue.shift()
    //         console.log(curNode.value)
    //
    //         if(curNode.left != undefined) {
    //             queue.push(curNode.left)
    //         }
    //
    //         if(curNode.right != undefined){
    //             queue.push(curNode.right)
    //         }
    //    }
    //
    //    console.log('copyTree', this.copyTree)
    // }


    componentDidUpdate = async () => {
        console.log('state was set')
    }

    componentDidMount = async () => {

        const treeData = await axios.get(`http://localhost:8080/tree`);
        let cloned = this.cloneTree(treeData.data.root)
        let clonedTree = [JSON.parse(JSON.stringify(cloned))];
        const dimensions = this.treeContainer.getBoundingClientRect();
        this.setState({
            ...this.state,
            tree: clonedTree,
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 5,
            }
        });
    }

    handleChange(event) {
        this.setState({...this.state, value: event.target.value});
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const addNodeResp = await axios.post(`http://localhost:8080/tree`, {'data': this.state.value});

        const treeData = await axios.get(`http://localhost:8080/tree`);
        let cloned = this.cloneTree(treeData.data.root)
        let clonedTree = [JSON.parse(JSON.stringify(cloned))];
        const dimensions = this.treeContainer.getBoundingClientRect();
        this.setState({
            ...this.state,
            tree: clonedTree,
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 5,
            }
        });
    }

    render(){
        return (
            <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
                <Tree data={this.state.tree} orientation={'vertical'} collapsible={false} translate={this.state.translate}  />

                <form onSubmit={this.handleSubmit}>
                    <label>
                        ADD NODE:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}