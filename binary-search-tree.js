function mergeSortRemoveDuplicate(sortArray = []) {
    if (sortArray.length < 2)
        return sortArray;
    else {
        let middle = Math.floor(sortArray.length / 2);
        let newLeftArray = mergeSortRemoveDuplicate(sortArray.slice(0,middle));
        let newRightArray = mergeSortRemoveDuplicate(sortArray.slice(middle));
        let finalArray = [];
        let i = 0;
        let j = 0;
        while (i < newLeftArray.length || j < newRightArray.length) {
            if ((j >= newRightArray.length) || newLeftArray[i] < newRightArray[j])
                finalArray.push(newLeftArray[i++]);
            else if ((i >= newLeftArray.length) || newLeftArray[i] > newRightArray[j])
                finalArray.push(newRightArray[j++]);
            else if(newLeftArray[i] === newRightArray[j]){
                finalArray.push(newRightArray[j++]);
                i++;
            }
        }
        return finalArray;
    }
}

const queue = (function () {
    queueArray = [];
    function push(node) {
        queueArray.push(node);
    }
    function pop() {
        const node = queueArray[0];
        queueArray.shift();
        return node;
    }
    function size() {
        return queueArray.length;
    }
    
    return {push,pop,size}
})();

class Node{
    constructor(value) {
        this.value = value;
        this.leftChild = null;
        this.rightChild = null;
    }
    setValue(value) {
        this.value = value;
    }
    setLeftChild(child) {
        this.leftChild = child;
    }

    setRightChild(child) {
        this.rightChild = child;
    }
    
    getLeftChild() {
        return this.leftChild;
    }

    getRightChild() {
        return this.rightChild;
    }

    getValue() {
        return this.value;
    }
}

class Tree{
    constructor(inputArray) {
        const sortedArray = mergeSortRemoveDuplicate(inputArray);
        this.root = buildTree(sortedArray,0,sortedArray.length-1);
    }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
        if (node === null) {
        return;
        }
        if (node.rightChild !== null) {
        prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.left !== null) {
        prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    };

function buildTree(array, start, end) {
    if (start > end) {
        return null;
    }
    let mid = Math.floor((end + start)/2);
    let node = new Node(array[mid]);
    node.setLeftChild(buildTree(array, start, mid - 1));
    node.setRightChild(buildTree(array, mid + 1, end));
    return node;
}

function insert(value,rootNode) {
    if (rootNode.getValue() > value)
        if (rootNode.getLeftChild() !== null)
            insert(value, rootNode.getLeftChild());
        else {
            let node = new Node(value);
            rootNode.setLeftChild(node);
            console.log("Inserted " + value);
        }
    else if (rootNode.getValue() < value)
        if (rootNode.getRightChild() !== null)
            insert(value, rootNode.getRightChild());
        else {
            let node = new Node(value);
            rootNode.setRightChild(node);
            console.log("Inserted " + value);
        }
    else
        console.log(value + "is a duplicate value");
}

function deleteNode (value, rootNode){
    const nodeDelete = find(value, rootNode);
    if (nodeDelete === null)
        return;
    else {
        removeNode(nodeDelete, rootNode);
    }
}

function findParentNode(node, rootNode) {
    if (rootNode === node) {
        return null;
    }
    if (rootNode.getLeftChild() === node || rootNode.getRightChild() === node)
        return rootNode;
    else if (rootNode.getValue() > node.getValue())
        return findParentNode(node, rootNode.getLeftChild());
    else if (rootNode.getValue() < node.getValue())
        return findParentNode(node, rootNode.getRightChild());
    
}

function removeNode(node, rootNode) {
    if (node.getLeftChild() === null && node.getRightChild() === null) {
        let parentNode = findParentNode(node, rootNode);
        if (parentNode !== null) {
            if (parentNode.getLeftChild() === node)
                parentNode.setLeftChild(null);
            else
                parentNode.setRightChild(null);
        }
        else {
            node.setValue(null);
        }
    }
    else if (node.getLeftChild() === null) {
        let parentNode = findParentNode(node, rootNode);
        if (parentNode !== null) {
            if (parentNode.getLeftChild() === node)
                parentNode.setLeftChild(node.getRightChild());
            else if (parentNode.getRightChild() === node)
                parentNode.setRightChild(node.getRightChild());
        }
        else {
            node.setValue(node.getRightChild().getValue());
            node.setRightChild(null);
        }
    }
    else if (node.getRightChild() === null) {
        let parentNode = findParentNode(node, rootNode);
        if (parentNode !== null) {
            if (parentNode.getRightChild() === node)
                parentNode.setRightChild(node.getLeftChild());
            else if (parentNode.getLeftChild() === node)
                parentNode.setLeftChild(node.getLeftChild());
        }
        else {
            node.setValue(node.getLeftChild().getValue());
            node.setLeftChild(null);
        }
    }
    else {
        const rightNode = node.getRightChild();
        const leftMostNode = findLeftMostNode(rightNode);
        const value = leftMostNode.getValue();
        removeNode(leftMostNode, rootNode);
        node.setValue(value);
    }
}

function findLeftMostNode(node) {
    if (node.getLeftChild() === null)
        return node;
    else
        return findLeftMostNode(node.getLeftChild());
}

function find(value, rootNode) {
    if (rootNode === null) {
        console.log("Given node is not found");
        return null;
    }
    if (rootNode.getValue() < value)
        return find(value, rootNode.getRightChild());
    else if (rootNode.getValue() > value)
        return find(value, rootNode.getLeftChild());
    else if (rootNode.getValue() === value)
        return rootNode;
}



function levelOrder(rootNode, cb = null) {
    queue.push(rootNode);
    let opArray = [];
    while (queue.size() > 0) {
        let currentNode = queue.pop();
        let currentNodeValue = currentNode.getValue();
        let currentNodeLeft = currentNode.getLeftChild();
        let currentNodeRight = currentNode.getRightChild();
        if (currentNodeValue !== null) {
            opArray.push(currentNodeValue);
            if (currentNodeLeft !== null) {
                queue.push(currentNodeLeft);
            }
            if (currentNodeRight !== null) {
                queue.push(currentNodeRight);
            }
            if (cb !== null) {
                cb(currentNode);
            }
        }
    }
    if (cb === null) {
        return opArray;
    }
}

function inOrder(rootNode, cb = null, opArray = []) {
    if (rootNode !== null) {
        inOrder(rootNode.getLeftChild(), cb, opArray);
        if (cb !== null) {
            cb(rootNode);
        }
        opArray.push(rootNode.getValue());
        inOrder(rootNode.getRightChild(), cb, opArray);
    }
    if (cb === null)
        return opArray;
}

function preOrder(rootNode, cb = null, opArray = []) {
    if (rootNode !== null) {
        if (cb !== null) {
            cb(rootNode);
        }
        opArray.push(rootNode.getValue());
        preOrder(rootNode.getLeftChild(), cb, opArray);
        preOrder(rootNode.getRightChild(), cb, opArray);
    }
    if (cb === null)
        return opArray;
}

function postOrder(rootNode, cb = null, opArray=[]) {
    if (rootNode !== null) {
        postOrder(rootNode.getLeftChild(), cb, opArray);
        postOrder(rootNode.getRightChild(), cb, opArray);
        if (cb !== null) {
            cb(rootNode);
        }
        opArray.push(rootNode.getValue());
    }
    if (cb === null)
        return opArray;
}

function height(rootNode) {
    let rootNodeLeft = rootNode.getLeftChild();
    let rootNodeRight = rootNode.getRightChild();
    if (rootNodeLeft !== null && rootNodeRight !== null)
        return Math.max(height(rootNodeLeft),height(rootNodeRight)) + 1;
    else if (rootNodeLeft !== null)
        return height(rootNodeLeft)+1;
    else if (rootNodeRight !== null)
        return height(rootNodeRight)+1;
    else
        return 0;
}

function depth(node, rootNode, count = 0) {
    if (rootNode === null) {
        console.log("Given node is not found");
        return null;
    }
    if (rootNode.getValue() < node.getValue())
        return depth(node, rootNode.getRightChild(),++count);
    else if (rootNode.getValue() > node.getValue())
        return depth(node, rootNode.getLeftChild(),++count);
    else if (rootNode.getValue() === node.getValue())
        return count;
}

function isBalanced(rootNode) {
    if (rootNode !== null) {
        let heightLeft, heightRight;
        if (rootNode.getLeftChild() !== null)
            heightLeft = height(rootNode.getLeftChild());
        else
            heightLeft = 0;
        if (rootNode.getRightChild() !== null)
            heightRight = height(rootNode.getRightChild());
        else
            heightRight = 0;
        let heightDifference = heightLeft - heightRight; 
        if (heightDifference > 1 || heightDifference < -1) {
            return false;
        }
        else {
            if (isBalanced(rootNode.getLeftChild()) === false) {
                return false;
            }
            else if (isBalanced(rootNode.getRightChild()) === false) {
                return false;
            }
            else
                return true;

        }
    }
}

function reBalance(rootNode) {
    console.log("Rebalancing");
    const newArray = inOrder(rootNode);
    tree = new Tree(newArray);
}




//----------------This is the driver script----------------------//

function generateRandomArray(count) {
    let newArray = [];
    for (i = 0; i < 100; i++){
        newArray.push(Math.floor(Math.random() * count));
    }

    return newArray;
}

function generatedRandomNumber(min, max) {
    let newNumber = 0;
    while (newNumber < min) {
        newNumber = Math.floor(Math.random() * max);
    }
    return newNumber;
}

let generatedArray = generateRandomArray(100);
let tree = new Tree(generatedArray);
prettyPrint(tree.root);
console.log("Is tree balanced?: " + isBalanced(tree.root));
console.log("Level order: ")
console.log(levelOrder(tree.root));
console.log("Pre order: ");
console.log(preOrder(tree.root));
console.log("In order: ");
console.log(inOrder(tree.root));
console.log("Post order: ");
console.log(postOrder(tree.root));
insert(generatedRandomNumber(100, 200),tree.root);
insert(generatedRandomNumber(100, 200),tree.root);
insert(generatedRandomNumber(100, 200),tree.root);
insert(generatedRandomNumber(100, 200),tree.root);
insert(generatedRandomNumber(100, 200),tree.root);
insert(generatedRandomNumber(100, 200),tree.root);
insert(generatedRandomNumber(100, 200),tree.root);
console.log("Is tree balanced?: " + isBalanced(tree.root));
reBalance(tree.root);
console.log("Is tree balanced?: " + isBalanced(tree.root));
console.log("Level order: ")
console.log(levelOrder(tree.root));
console.log("Pre order: ");
console.log(preOrder(tree.root));
console.log("In order: ");
console.log(inOrder(tree.root));
console.log("Post order: ");
console.log(postOrder(tree.root));  
