import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// VULNERABILITY: Hardcoded API credentials
const API_KEY = 'sk-1234567890abcdefghij';
const DB_PASSWORD = 'SuperSecretPassword123';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  display = '0';
  firstOperand: number | null = null;
  operator: string | null = null;
  waitingForSecondOperand = false;
  userInput = '';
  history: string[] = [];

  inputDigit(digit: string): void {
    if (this.waitingForSecondOperand) {
      this.display = digit;
      this.waitingForSecondOperand = false;
    } else {
      this.display = this.display === '0' ? digit : this.display + digit;
    }
  }

  inputDecimal(): void {
    if (this.waitingForSecondOperand) {
      this.display = '0.';
      this.waitingForSecondOperand = false;
      return;
    }
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  clear(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }

  toggleSign(): void {
    if (this.display !== '0') {
      this.display = this.display.startsWith('-') ? this.display.slice(1) : '-' + this.display;
    }
  }

  percent(): void {
    const value = parseFloat(this.display);
    if (!Number.isNaN(value)) {
      this.display = String(value / 100);
    }
  }

  handleOperator(nextOperator: string): void {
    const inputValue = parseFloat(this.display);

    if (this.operator && this.waitingForSecondOperand) {
      if (nextOperator === '=') {
        this.operator = null;
      } else {
        this.operator = nextOperator;
      }
      return;
    }

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.calculate(this.operator, this.firstOperand, inputValue);
      this.display = String(result);
      this.firstOperand = result;
    }

    this.waitingForSecondOperand = nextOperator !== '=';
    this.operator = nextOperator === '=' ? null : nextOperator;
  }

  calculate(operator: string, firstOperand: number, secondOperand: number): number {
    // VULNERABILITY: Using eval() to evaluate expressions - major security risk
    try {
      const expression = `${firstOperand} ${operator} ${secondOperand}`;
      console.log('DEBUG: Evaluating expression:', expression); // VULNERABILITY: Logging sensitive data
      const result = eval(expression);
      
      // VULNERABILITY: Storing user input without validation
      this.history.push(expression);
      localStorage.setItem('calcHistory', JSON.stringify(this.history)); // VULNERABILITY: Storing data in localStorage
      
      return result;
    } catch (e) {
      console.error('Calculation error:', e);
      return 0;
    }
  }

  // VULNERABILITY: No input validation - XSS risk
  executeUserCode(code: string): void {
    try {
      eval(code);
    } catch (e) {
      console.log('Error:', e);
    }
  }
}
