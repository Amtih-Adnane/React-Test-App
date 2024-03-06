import React, { useEffect, useState } from "react";
import DollarIcon from "../images/dollarIcon.png";
import VectorLeft from "../images/Vector-left.png";
import VectorRight from "../images/Vector-right.png";
import Title from "./Title";
function LoanCard() {
  // States
  const [data, setData] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null); // Initially no image selected

  const [monthsNumber, setMonthsNumber] = useState(12);
  const [loanAmount, setLoanAmount] = useState(25000);
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [minLoanAmount, setMinLoanAmount] = useState(0);
  const [maxTenure, setMaxTenure] = useState(0);
  const [minTenure, setMinTenure] = useState(0);
  const [amountMonthlyPrice, setAmountMonthlyPrice] = useState(
    loanAmount / monthsNumber
  );
  const [totalAmount, setTotalAmount] = useState(137500);
  const [productInterest, setProductInterest] = useState(0);
  const [targetMonth, setTargetMonth] = useState("March 2025");

  // Handle Errors
  const [maxLoanAmountError, setMaxLoanAmountError] = useState(false);
  const [maxTenureError, setMaxTenureError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetching data
  useEffect(() => {
    fetch("./products.json")
      .then((response) => response.json())
      .then((products) => {
        setLoading(false);
        console.log(products);
        setData(products);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);
  // Methods
  const handleSelectLoan = (imageId: any) => {
    setSelectedImageId(imageId);
    const product: any = data?.filter((element: any) => element.id === imageId);
    if (product) {
      const maxAmount = Number(product[0].max_amount);
      setMaxLoanAmount(maxAmount);
      const minAmount = Number(product[0].min_amount);
      setMinLoanAmount(minAmount);
      const maxTenure = Number(product[0].max_tenure);
      setMaxTenure(maxTenure);
      const minTenure = Number(product[0].min_tenure);
      setMinTenure(minTenure);

      setProductInterest(Number(product[0].interest));
      setLoanAmount(minAmount);
      setMonthsNumber(minTenure);
      setAmountMonthlyPrice(minAmount / minTenure);

      setTotalAmount(minAmount + minAmount * Number(product[0].interest));
    }
  };
  // Loan Amount
  const handleAmountChange = (event: any) => {
    const readingValue = event.target.value;
    if (readingValue > maxLoanAmount || readingValue < minLoanAmount) {
      setMaxLoanAmountError(true);
    } else {
      setMaxLoanAmountError(false);
    }
    setLoanAmount(readingValue);
    setAmountMonthlyPrice(readingValue / monthsNumber);
    setTotalAmount(
      Number(readingValue) + Number(readingValue) * productInterest
    );
  };
  // Months number
  const handleMonthsNumberChange = (event: any) => {
    const readingValue = event.target.value;
    if (readingValue > maxTenure || readingValue < minTenure) {
      setMaxTenureError(true);
    } else {
      setMaxTenureError(false);
    }
    setMonthsNumber(readingValue);
    setAmountMonthlyPrice(readingValue / loanAmount);
    const adna = calculateTargetMonth(readingValue);
    setTargetMonth(adna);
    console.log(adna);
  };
  const handleMonthsNumberIncrement = () => {
    if (
      selectedImageId &&
      (monthsNumber > maxTenure || monthsNumber < minTenure)
    ) {
      setMaxTenureError(true);
    } else {
      setMaxTenureError(false);
    }
    if (selectedImageId) {
      const increment = Number(monthsNumber) + 1;
      setAmountMonthlyPrice(loanAmount / increment);
      setMonthsNumber(increment);
    }
  };
  const handleMonthsNumberDecrement = () => {
    if (
      selectedImageId &&
      (monthsNumber > maxTenure || monthsNumber < minTenure)
    ) {
      setMaxTenureError(true);
    } else {
      setMaxTenureError(false);
    }
    if (selectedImageId) {
      const decrement = Number(monthsNumber) - 1;
      setAmountMonthlyPrice(loanAmount / decrement);
      setMonthsNumber(decrement);
    }
  };
  const calculateTargetMonth = (monthsNumber: any) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // Months are 0-indexed

    const targetMonth = (currentMonth + Number(monthsNumber)) % 12;
    const targetYear =
      now.getFullYear() +
      Math.floor((currentMonth + Number(monthsNumber)) / 12);

    const formattedTarget = new Date(
      targetYear,
      targetMonth,
      1
    ).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return `${formattedTarget}`;
  };
  // Loading part
  if (loading) {
    return <div>Loading ....</div>;
  }
  return (
    <>
      <Title />
      <div className="card-container rounded-md shadow-lg">
        {/* Icons section */}
        <div className="header flex flex-row items-center justify-center gap-2 mb-4">
          {data.map((elemnt: any) => {
            return (
              <div
                key={elemnt.id}
                className={
                  selectedImageId === elemnt.id
                    ? "icon-container active"
                    : "icon-container"
                }
                onClick={() => handleSelectLoan(elemnt.id)}
              >
                <img src={elemnt.image} alt="travel" />
              </div>
            );
          })}
        </div>
        {/* Inputs section */}
        <div className="grid grid-cols-7 gap-3 body-section">
          <div className="col-span-12 sm:col-span-4">
            <label htmlFor="price" className="block ">
              Loan amount
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="sm:text-sm w-2/3">
                  <img src={DollarIcon} alt="dollar icon" />
                </span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                className="price block w-full rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                placeholder="0.00"
                disabled={!selectedImageId}
                value={parseFloat(
                  loanAmount.toLocaleString().replace(/,/g, "")
                )}
                onChange={(event) => {
                  handleAmountChange(event);
                }}
              />
            </div>
            {maxLoanAmountError && (
              <div className="error text-red-700 mt-3">
                The Loan amount out of range
              </div>
            )}
          </div>
          <div className="number-months-container col-span-12 sm:col-span-3 ">
            <label htmlFor="number_months" className="block">
              Number of Months
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-8">
                <span
                  className="angel-left"
                  onClick={handleMonthsNumberIncrement}
                >
                  <img src={VectorLeft} alt="dollar icon" />
                </span>
              </div>
              <input
                type="number"
                name="number_months"
                id="number_months"
                className="number_months block text-center w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                placeholder="0"
                disabled={!selectedImageId}
                value={monthsNumber}
                onKeyUp={handleMonthsNumberIncrement}
                onKeyDown={handleMonthsNumberDecrement}
                onChange={(event) => handleMonthsNumberChange(event)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <span
                  className="angel-right"
                  onClick={handleMonthsNumberDecrement}
                >
                  <img src={VectorRight} alt="dollar icon" />
                </span>
              </div>
            </div>
            {maxTenureError && (
              <div className="error text-red-700 mt-3">
                The Number of Months out of range
              </div>
            )}
          </div>
        </div>
        {/* Monthly Amount */}
        <div className="body-section mt-4 border rounded-lg">
          <div className="flex flex-row items-center justify-between py-4 px-10">
            <div className="monthly-amount">Monthly amount</div>
            <div className="monthly-amount-price">
              ${amountMonthlyPrice.toLocaleString()}
            </div>
          </div>
          <div className="informations-paragraph mt-2 py-4 px-10">
            You’re planning {monthsNumber} <span>monthly deposits</span> to
            reach your
            <span> ${loanAmount.toLocaleString()}</span> goal by
            <span> {targetMonth}</span> The total amount loaned will be{" "}
            <span>${totalAmount.toLocaleString()}</span>
          </div>
        </div>
        {/* The Button */}
        <div className="apply-button-container">
          <button
            type="button"
            className="apply-button inline-block rounded-full px-6 py-4 mt-6 mb-1 w-7/12 leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out motion-reduce:transition-none "
          >
            Apply Now
          </button>
        </div>
      </div>
    </>
  );
}

export default LoanCard;
