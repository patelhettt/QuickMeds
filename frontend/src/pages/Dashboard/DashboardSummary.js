import React, { useEffect, useState } from "react";
import PrintButton from "../../components/buttons/PrintButton";
import RefreshButton from "../../components/buttons/RefreshButton";
import InfoCard from "../../components/InfoCard";

const DashboardSummary = () => {
  const [pharmacyProducts, setPharmacyProducts] = useState([]);
  const [nonPharmacyProducts, setNonPharmacyProducts] = useState([]);
  const [pharmacyRequestedItems, setPharmacyRequestedItems] = useState([]);
  const [nonPharmacyRequestedItems, setNonPharmacyRequestedItems] = useState(
    []
  );
  const [pharmacyOrders, setPharmacyOrders] = useState([]);
  const [nonPharmacyOrders, setNonPharmacyOrders] = useState([]);
  const [pharmacyPurchases, setPharmacyPurchases] = useState([]);
  const [nonPharmacyPurchases, setNonPharmacyPurchases] = useState([]);
  const [returnsCustomers, setReturnsCustomers] = useState([]);
  const [returnsExpiresOrDamages, setReturnsExpiresOrDamages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliersLists, setSuppliersLists] = useState([]);
  const [suppliersPayments, setSuppliersPayments] = useState([]);
  const [suppliersDocuments, setSuppliersDocuments] = useState([]);

  const fetchData = () => {
    Promise.all([
      fetch("http://localhost:5000/api/products/pharmacy")
        .then((res) => res.json())
        .then((data) => setPharmacyProducts(data.length)),
        
      fetch("http://localhost:5000/api/products/nonPharmacy")
        .then((res) => res.json())
        .then((data) => setNonPharmacyProducts(data.length)),

      fetch("http://localhost:5000/api/requestedItems/pharmacy")
        .then((res) => res.json())
        .then((data) => setPharmacyRequestedItems(data.length)),

      fetch("http://localhost:5000/api/requestedItems/nonPharmacy")
        .then((res) => res.json())
        .then((data) => setNonPharmacyRequestedItems(data.length)),
        
      fetch("http://localhost:5000/api/orders/pharmacy")
        .then((res) => res.json())
        .then((data) => setPharmacyOrders(data.length)),

      fetch("http://localhost:5000/api/orders/nonPharmacy")
        .then((res) => res.json())
        .then((data) => setNonPharmacyOrders(data.length)),

      fetch("http://localhost:5000/api/purchases/pharmacy")
        .then((res) => res.json())
        .then((data) => setPharmacyPurchases(data.length)),

      fetch("http://localhost:5000/api/purchases/nonPharmacy")
        .then((res) => res.json())
        .then((data) => setNonPharmacyPurchases(data.length)),

      fetch("http://localhost:5000/api/returns/customers")
        .then((res) => res.json())
        .then((data) => setReturnsCustomers(data.length)),

      fetch("http://localhost:5000/api/returns/expiresOrDamagesReturns")
        .then((res) => res.json())
        .then((data) => setReturnsExpiresOrDamages(data.length)),

      fetch("http://localhost:5000/api/setup/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data.length)),

      fetch("http://localhost:5000/api/setup/unitTypes")
        .then((res) => res.json())
        .then((data) => setUnitTypes(data.length)),

      fetch("http://localhost:5000/api/setup/companies")
        .then((res) => res.json())
        .then((data) => setCompanies(data.length)),

      fetch("http://localhost:5000/api/products/employees")
        .then((res) => res.json())
        .then((data) => setEmployees(data.length)),

      fetch("http://localhost:5000/api/products/customers")
        .then((res) => res.json())
        .then((data) => setCustomers(data.length)),

      fetch("http://localhost:5000/api/suppliers/lists")
        .then((res) => res.json())
        .then((data) => setSuppliersLists(data.length)),

      fetch("http://localhost:5000/api/suppliers/payments")
        .then((res) => res.json())
        .then((data) => setSuppliersPayments(data.length)),

      fetch("http://localhost:5000/api/suppliers/documents")
        .then((res) => res.json())
        .then((data) => setSuppliersDocuments(data.length)),
    ])
      .then(() => console.log("Data refreshed"))
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 mt-16">
      <div className="flex justify-between mb-6">
        <RefreshButton onClick={fetchData} />
        <PrintButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InfoCard name={"Products Non Pharmacy"} status={nonPharmacyProducts} />

        <InfoCard name={"Products Pharmacy"} status={pharmacyProducts} />

        <InfoCard
          name={"Requested Items Pharmacy"}
          status={pharmacyRequestedItems}
        />

        <InfoCard
          name={"Requested Items Non Pharmacy"}
          status={nonPharmacyRequestedItems}
        />

        <InfoCard name={"Orders Pharmacy"} status={pharmacyOrders} />

        <InfoCard name={"Orders Non Pharmacy"} status={nonPharmacyOrders} />

        <InfoCard name={"Purchases Pharmacy"} status={pharmacyPurchases} />

        <InfoCard
          name={"Purchases Non Pharmacy"}
          status={nonPharmacyPurchases}
        />

        <InfoCard name={"Returns Customers"} status={returnsCustomers} />

        <InfoCard
          name={"Returns Expires / Returns"}
          status={returnsExpiresOrDamages}
        />

        <InfoCard name={"Categories"} status={categories} />

        <InfoCard name={"Unit Types"} status={unitTypes} />

        <InfoCard name={"Companies"} status={companies} />

        <InfoCard name={"Employees"} status={employees} />

        <InfoCard name={"Customers"} status={customers} />

        <InfoCard name={"Suppliers"} status={suppliersLists} />

        <InfoCard name={"Payments"} status={suppliersPayments} />

        <InfoCard name={"Documents"} status={suppliersDocuments} />
      </div>
    </div>
  );
};

export default DashboardSummary;