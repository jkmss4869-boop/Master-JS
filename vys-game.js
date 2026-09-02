const VYSGame = (() => {

  // ==========================================================
  // CẤU HÌNH MẶC ĐỊNH
  // ==========================================================

  let API_URL =
    "https://script.google.com/macros/s/AKfycbyg_srgOPCBUwamR_ArHzhM5xuGw-wPV3OfRIdHRWGqK1fShEK0r031R9zsoGYyxOdy6Q/exec";

  let GAME_LINK = "";


  // ==========================================================
  // KHỞI TẠO
  // ==========================================================

  function init(config = {}) {

    // Nếu game truyền API mới → dùng API mới
    // Nếu không → giữ API mặc định
    API_URL = config.apiUrl || API_URL;

    // URL thật của trang Google Sites chứa game
    GAME_LINK = config.gameLink || GAME_LINK;

    if (!API_URL) {
      console.warn("VYSGame: Chưa cấu hình API URL.");
    }

    if (!GAME_LINK) {
      console.warn(
        "VYSGame: Chưa cấu hình gameLink. " +
        "Nếu game được nhúng trong Google Sites, hãy truyền gameLink khi init()."
      );
    }

    return VYSGame;
  }


  // ==========================================================
  // POST CHUNG
  // ==========================================================

  async function post(data) {

    if (!API_URL) {
      throw new Error(
        "VYSGame: API URL chưa được cấu hình."
      );
    }

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },

      body: JSON.stringify(data)
    });

    const text = await response.text();

    return {
      ok: response.ok,
      data: text
    };
  }


  // ==========================================================
  // LƯU ĐIỂM
  // ==========================================================

  async function saveScore({
    playerName,
    lessonName,
    gameType,
    score,
    total,
    gameLink
  } = {}) {

    // --------------------------------------------------------
    // KIỂM TRA DỮ LIỆU BẮT BUỘC
    // --------------------------------------------------------

    if (!playerName) {
      throw new Error(
        "VYSGame.saveScore: Thiếu playerName."
      );
    }

    if (!lessonName) {
      throw new Error(
        "VYSGame.saveScore: Thiếu lessonName."
      );
    }

    if (!gameType) {
      throw new Error(
        "VYSGame.saveScore: Thiếu gameType."
      );
    }

    if (score === undefined || score === null) {
      throw new Error(
        "VYSGame.saveScore: Thiếu score."
      );
    }

    if (total === undefined || total === null) {
      throw new Error(
        "VYSGame.saveScore: Thiếu total."
      );
    }


    // --------------------------------------------------------
    // XÁC ĐỊNH GAME LINK
    // --------------------------------------------------------
    //
    // Ưu tiên:
    //
    // 1. gameLink truyền trực tiếp vào saveScore()
    // 2. gameLink được cấu hình trong init()
    // 3. document.referrer
    // 4. window.location.href
    //
    // Trong Google Sites, cách 1 hoặc 2 sẽ đảm bảo
    // lấy đúng URL trang Google Sites.
    // --------------------------------------------------------

    const finalGameLink =
      gameLink ||
      GAME_LINK ||
      document.referrer ||
      window.location.href;


    // --------------------------------------------------------
    // TẠO PAYLOAD
    // --------------------------------------------------------

    const payload = {

      action: "saveScore",

      playerName: playerName,

      lessonName: lessonName,

      gameType: gameType,

      score: score,

      total: total,

      gameLink: finalGameLink

    };


    // --------------------------------------------------------
    // GỬI API
    // --------------------------------------------------------

    return await post(payload);
  }


  // ==========================================================
  // LƯU TOÀN BỘ CHI TIẾT
  // ==========================================================

  async function saveDetails({
    playerName,
    exerciseName,
    details
  } = {}) {

    if (!playerName) {
      throw new Error(
        "VYSGame.saveDetails: Thiếu playerName."
      );
    }

    if (!exerciseName) {
      throw new Error(
        "VYSGame.saveDetails: Thiếu exerciseName."
      );
    }

    if (!Array.isArray(details)) {
      throw new Error(
        "VYSGame.saveDetails: details phải là một Array."
      );
    }


    const payload = {

      action: "saveDetailList",

      playerName: playerName,

      exerciseName: exerciseName,

      details: details

    };


    return await post(payload);
  }


  // ==========================================================
  // LƯU MỘT CHI TIẾT
  // ==========================================================

  async function saveDetail({
    playerName,
    exerciseName,
    question,
    userAnswer,
    correctAnswer,
    isCorrect,
    ...extraData
  } = {}) {

    if (!playerName) {
      throw new Error(
        "VYSGame.saveDetail: Thiếu playerName."
      );
    }

    if (!exerciseName) {
      throw new Error(
        "VYSGame.saveDetail: Thiếu exerciseName."
      );
    }


    const payload = {

      action: "saveDetail",

      playerName: playerName,

      exerciseName: exerciseName,

      question: question || "",

      userAnswer: userAnswer ?? "",

      correctAnswer: correctAnswer ?? "",

      isCorrect: Boolean(isCorrect),

      ...extraData

    };


    return await post(payload);
  }


  // ==========================================================
  // PUBLIC API
  // ==========================================================

  return {

    init,

    saveScore,

    saveDetails,

    saveDetail

  };

})();