import { Component } from '@angular/core';

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
    switch (operator) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': return secondOperand !== 0 ? firstOperand / secondOperand : 0;
      default: return secondOperand;
    }
  }
}
