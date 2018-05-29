import * as _ from 'lodash';
import { TreeviewItem } from './treeview-item';

export const TreeviewHelper = {
    findItem: findItem,
    findItemInList: findItemInList,
    findParent: findParent,
    removeItem: removeItem
};

function findItem(root: TreeviewItem, userId: any): TreeviewItem {
    if (_.isNil(root)) {
        return undefined;
    }

    if (root.userId === userId) {
        return root;
    }

    if (root.children) {
        for (const child of root.children) {
            const foundItem = findItem(child, userId);
            if (foundItem) {
                return foundItem;
            }
        }
    }

    return undefined;
}

function findItemInList(list: TreeviewItem[], userId: any): TreeviewItem {
    if (_.isNil(list)) {
        return undefined;
    }

    for (const item of list) {
        const foundItem = findItem(item, userId);
        if (foundItem) {
            return foundItem;
        }
    }

    return undefined;
}

function findParent(root: TreeviewItem, item: TreeviewItem): TreeviewItem {
    if (_.isNil(root) || _.isNil(root.children)) {
        return undefined;
    }

    for (const child of root.children) {
        if (child === item) {
            return root;
        } else {
            const parent = findParent(child, item);
            if (parent) {
                return parent;
            }
        }
    }

    return undefined;
}

function removeItem(root: TreeviewItem, item: TreeviewItem): boolean {
    const parent = findParent(root, item);
    if (parent) {
        _.pull(parent.children, item);
        if (parent.children.length === 0) {
            parent.children = undefined;
        } else {
            parent.correctChecked();
        }
        return true;
    }

    return false;
}
