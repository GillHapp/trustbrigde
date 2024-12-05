# **Escrow Smart Contract**

## **Introduction**
The `Escrow` smart contract is designed to securely manage payments between a **Depositor**, a **Beneficiary**, and an **Arbiter**. It ensures that funds are only released to the beneficiary when conditions are met and approved by the arbiter. If the agreement fails, the depositor can reclaim the funds.

---

## **Features**
1. **Secure Payment Management**:
   - Funds are locked in the contract until the arbiter decides the outcome.

2. **Roles in the Contract**:
   - **Depositor**: The person who deposits the funds.
   - **Beneficiary**: The person who receives the funds upon approval.
   - **Arbiter**: The trusted person who decides if the funds should be released or refunded.

3. **Approval and Unlock Mechanism**:
   - The arbiter can **approve** the payment (funds go to the beneficiary).
   - The arbiter can **unlock** the payment (funds go back to the depositor).

---

## **How It Works**
### **1. Create Payment**
The depositor creates a payment by locking funds into the contract and assigning an arbiter and beneficiary.
```solidity
function createPayment(address _arbiter, address _beneficiary) external payable;
```
- **Requirements**:
  - Depositor cannot be the arbiter or the beneficiary.
  - Minimum deposit: `0.01 ETH`.

---

### **2. Approve Payment**
The arbiter approves the payment, allowing the beneficiary to withdraw funds.
```solidity
function approvePayment(uint _id) external;
```
- **Requirements**:
  - Only the arbiter can approve.
  - Payment must not already be approved or unlocked.

---

### **3. Unlock Payment**
The arbiter unlocks the payment, allowing the depositor to reclaim funds.
```solidity
function unlockPayment(uint _id) external;
```
- **Requirements**:
  - Only the arbiter can unlock.
  - Payment must not already be approved or unlocked.

---

### **4. Withdraw for Beneficiary**
The beneficiary can withdraw funds after the payment is approved.
```solidity
function withdrawBeneficiary(uint _id) external;
```
- **Requirements**:
  - Only the beneficiary can withdraw.
  - Payment must be active and approved.

---

### **5. Withdraw for Depositor**
The depositor can withdraw funds if the payment is unlocked.
```solidity
function withdrawDepositor(uint _id) external;
```
- **Requirements**:
  - Only the depositor can withdraw.
  - Payment must be active and unlocked.

---

## **Events**
The contract emits the following events to track actions:
- `Created(uint)` – When a new payment is created.
- `Approved(uint)` – When a payment is approved.
- `Unlocked(uint)` – When a payment is unlocked.
- `Depositor_Withdraw(uint)` – When a depositor withdraws funds.
- `Beneficiary_Withdraw(uint)` – When a beneficiary withdraws funds.

---

## **Usage Example**
1. Alice (Depositor) locks **1 ETH** in the contract for Bob (Beneficiary) with Charlie (Arbiter) as the judge.
2. If Bob completes the task:
   - Charlie calls `approvePayment` to approve the payment.
   - Bob calls `withdrawBeneficiary` to withdraw **1 ETH**.
3. If the deal fails:
   - Charlie calls `unlockPayment` to unlock the payment.
   - Alice calls `withdrawDepositor` to reclaim her **1 ETH**.

---

## **Contract Storage**
- **Payment Struct**:
  Stores details of each payment:
  ```solidity
  struct Payment {
      uint amount;
      address arbiter;
      address depositor;
      address beneficiary;
      bool isApproved;
      bool isUnlocked;
      bool isActive;
  }
  ```
- **ID Counter**:
  Tracks the unique ID for each payment.
  ```solidity
  uint public id;
  ```
- **Payments Mapping**:
  Maps payment IDs to payment details.
  ```solidity
  mapping(uint => Payment) public payments;
  ```

---

## **Requirements**
- Solidity version: `^0.8.0`.
- Minimum deposit: `0.01 ETH`.
- Arbiter must be a trusted party.

---

## **License**
This project is licensed under the **Unlicense**.