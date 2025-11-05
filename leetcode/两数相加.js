/**
 * 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
 * 请你将两个数相加，并以相同形式返回一个表示和的链表。
 * 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 * */

// 用js表示链表
class ListNode {
  constructor(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

/**
 *
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function addTwoNumbers(l1, l2) {
  // 初始化一个空链表
  const head = new ListNode();
  // 复制链表用来递归
  let tail = head;
  // 定义一个变量（carry）表示两个数相加的进位
  let carry = 0;

  // 循环遍历相加两个链表
  while (l1 || l2) {
    // 两个节点的值相加再加上进位
    const sum = (l1?.val || 0) + (l2?.val || 0) + carry;

    // 更新进位
    carry = Math.floor(sum / 10);

    // 下一个节点的值就是上一次两个节点相加的个位数
    tail.next = new ListNode(sum % 10);

    // 把当前节点往下传进行递归，直到链表的末尾
    tail = tail.next;
    l1 = l1?.next;
    l2 = l2.next;
  }

  // 链表遍历结束后检查进位是否大于0，如果是还要再追加一个节点
  if (carry > 0) {
    tail.next = new ListNode(1);
  }
  return head.next;
}
