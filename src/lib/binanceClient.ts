import axios from "axios";

const BINANCE_API_BASE_URL = "https://api.binance.com/api/v3";

const binanceClient = axios.create({
  baseURL: BINANCE_API_BASE_URL,
});

export default binanceClient;
