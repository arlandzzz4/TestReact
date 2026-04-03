// src/MapPage.jsx
import { useState, useEffect, useRef } from "react";
import "../../scss/MapPage.scss";

const MapPage = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]); // 필터링된 결과
  const [selectedGym, setSelectedGym] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // 필터 상태
  const [filters, setFilters] = useState({
    "헬스/피트니스": true, //헬스,피트니스 => "헬스/피트니스로 통합"
    "요가/필라테스": true, //요가,필라테스 => "요가/필라테스로 통합"
    복싱: true,
    크로스핏: true,
    MMA: true,
    태권도: true,
  });

  const [radius, setRadius] = useState(2000); // 반경 state

  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);
  const infowindow = useRef(null); // 인포윈도우 ref
  const flagMarker = useRef(null); // 검색 위치 마커
  const myMarker = useRef(null); // 현재 위치 마커


  // 카카오맵 SDK 동적 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=a64b772b10f603c9c422cffb8d1373e0&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
        console.log("✅ 카카오맵 SDK 로드 완료!");
      });
    };

    script.onerror = () => {
      console.error("❌ 카카오맵 SDK 로드 실패");
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!mapLoaded || !mapContainer.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 5,
    };

    mapInstance.current = new window.kakao.maps.Map(
      mapContainer.current,
      options,
    );
    console.log("✅ 지도 초기화 완료!");
  }, [mapLoaded]);

  // 인포윈도우 닫기
  const closeInfowindow = () => {
    if (infowindow.current) infowindow.current.close();
  };

  window.deletePin = async (pinId) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/map/pins/${pinId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        alert("핀이 삭제됐어요!");
        if (infowindow.current) infowindow.current.close();
        window.location.reload();
      } else {
        alert("삭제에 실패했어요.");
      }
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("서버 연결에 실패했어요.");
    }
  };

  window.closeInfowindow = () => {
    if (infowindow.current) infowindow.current.close();
  };

  const fetchCustomPins = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/map/pins");
      const data = await response.json();
      console.log("📌 DB에서 불러온 핀 목록:", data);
      displayCustomPins(data);
    } catch (error) {
      console.error("❌ 핀 목록 불러오기 실패:", error);
    }
  };

  const displayCustomPins = (pins) => {
    pins.forEach((pin) => {
      const svgMarker = `
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="62" viewBox="0 0 50 62">
        <path d="M25,0 C11.2,0 0,11.2 0,25 C0,43.8 25,62 25,62 S50,43.8 50,25 C50,11.2 38.8,0 25,0 Z"
              fill="#FF6B35" stroke="white" stroke-width="2"/>
        <text x="25" y="20" text-anchor="middle" font-size="16" fill="white">📌</text>
        <text x="25" y="36" text-anchor="middle" font-size="9" font-weight="bold"
              fill="white" font-family="sans-serif">${pin.placeName.slice(0, 3)}</text>
      </svg>
    `;
      const svgBlob = new Blob([svgMarker], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const imageSize = new window.kakao.maps.Size(36, 45);
      const imageOption = { offset: new window.kakao.maps.Point(18, 45) };
      const markerImage = new window.kakao.maps.MarkerImage(
        url,
        imageSize,
        imageOption,
      );

      const position = new window.kakao.maps.LatLng(
        pin.latitude,
        pin.longitude,
      );
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstance.current,
        image: markerImage,
        zIndex: 11,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (infowindow.current) infowindow.current.close();
        const content = `
    <div style="padding:12px 16px; font-size:13px; min-width:200px; line-height:1.8; position:relative;">
      <button onclick="window.closeInfowindow()"
        style="position:absolute; top:4px; right:8px; background:none; border:none; font-size:16px; cursor:pointer; color:#aaa;">✕</button>
      <strong style="font-size:15px;">📌 ${pin.placeName}</strong><br/>
      <span style="color:#3D6B4F;">🏷️ ${pin.facilityType}</span><br/>
      ${pin.comment ? `💬 ${pin.comment}<br/>` : ""}
      <span style="color:#aaa; font-size:11px;">등록자: ${pin.nickname || "익명"}</span><br/>
      <button
        onclick="window.deletePin(${pin.pinId}, this)"
        style="margin-top:8px; padding:4px 12px; background:#ff4444; color:white; border:none; border-radius:6px; cursor:pointer; font-size:12px;">
        🗑️ 삭제
      </button>
    </div>
  `;
        infowindow.current = new window.kakao.maps.InfoWindow({ content });
        infowindow.current.open(mapInstance.current, marker);
      });
    });
    console.log(`📍 DB 핀 ${pins.length}개 지도에 표시 완료!`);
  };
  // 필터 변경 시 필터링 적용
  useEffect(() => {
    applyFilters();
  }, [filters, gyms]);

  // 필터 체크박스 토글
  const handleFilterChange = (keyword) => {
    setFilters((prev) => ({
      ...prev,
      [keyword]: !prev[keyword],
    }));
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    const allSelected = Object.values(filters).every((v) => v);
    const newFilters = {};
    Object.keys(filters).forEach((key) => {
      newFilters[key] = !allSelected;
    });
    setFilters(newFilters);
  };

  // 필터 적용
  const applyFilters = () => {
    const activeKeywords = Object.keys(filters).filter((key) => filters[key]);
    const filterKeyMap = {
      "헬스/피트니스": ["헬스장", "헬스클럽", "짐", "피트니스"],
      "요가/필라테스": ["요가", "필라테스"],
      복싱: ["복싱"],
      크로스핏: ["크로스핏"],
      MMA: ["MMA"],
      태권도: ["태권도"],
    };
    const filtered = gyms.filter((gym) => {
      return activeKeywords.some((keyword) => {
        const matchKeys = filterKeyMap[keyword] || [keyword];
        return matchKeys.includes(gym._matchedFilter);
      });
    });

    setFilteredGyms(filtered);
    displayMarkers(filtered);
    console.log(`🔍 필터 적용: ${filtered.length}개 표시`);
  };

// 내 주변 검색
const handleMyLocation = () => {
  if (!mapLoaded) return;
  if (!navigator.geolocation) {
    alert('위치 정보를 지원하지 않는 브라우저예요');
    return;
  }

  setLoading(true);
  setGyms([]);
  setFilteredGyms([]);
  setSelectedGym(null);

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const myPosition = new window.kakao.maps.LatLng(lat, lng);

      // 지도 중심 이동
      mapInstance.current.setCenter(myPosition);
      mapInstance.current.setLevel(5);

      // 기존 내 위치 마커 제거 후 새로 표시
      if (myMarker.current) myMarker.current.setMap(null);
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="#4A90E2" stroke="white" stroke-width="2"/>
          <circle cx="10" cy="10" r="3" fill="white"/>
        </svg>
      `;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const myImage = new window.kakao.maps.MarkerImage(
        url,
        new window.kakao.maps.Size(20, 20),
        { offset: new window.kakao.maps.Point(10, 10) }
      );
      myMarker.current = new window.kakao.maps.Marker({
        position: myPosition,
        map: mapInstance.current,
        image: myImage,
        zIndex: 10,
      });

      setCurrentLocation({ lat, lng, name: '내 현재 위치' });

      // 깃발 제거
      if (flagMarker.current) flagMarker.current.setMap(null);

      searchNearbyGyms(lat, lng);
    },
    () => {
      alert('위치 정보를 가져올 수 없어요. 브라우저 위치 권한을 확인해주세요.');
      setLoading(false);
    }
  );
};





  // 검색 실행
  const handleSearch = () => {
    if (!mapLoaded) {
      alert("지도를 로딩 중입니다. 잠시만 기다려주세요.");
      return;
    }

    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요");
      return;
    }

    setLoading(true);
    setGyms([]);
    setFilteredGyms([]);
    setSelectedGym(null);

    const ps = new window.kakao.maps.services.Places();

    // 1단계: 검색어로 위치 찾기
    ps.keywordSearch(searchQuery, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const firstResult = data[0];
        const lat = parseFloat(firstResult.y);
        const lng = parseFloat(firstResult.x);

        // 지도 중심 이동
        const moveLatLon = new window.kakao.maps.LatLng(lat, lng);
        mapInstance.current.setCenter(moveLatLon);
        mapInstance.current.setLevel(5);

        setCurrentLocation({ lat, lng, name: firstResult.place_name });

        // 검색 지점 마커
        const flagSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
    <line x1="4" y1="0" x2="4" y2="40" stroke="#555" stroke-width="2"/>
    <polygon points="4,2 28,12 4,22" fill="#00aa44"/>
  </svg>
`;
        const flagBlob = new Blob([flagSvg], { type: "image/svg+xml" });
        const flagUrl = URL.createObjectURL(flagBlob);
        const searchMarkerImage = new window.kakao.maps.MarkerImage(
          flagUrl,
          new window.kakao.maps.Size(30, 40),
          { offset: new window.kakao.maps.Point(4, 40) },
        );

        // 검색할 때마다 검색한 위치 깃발 추가되는거 수정
        if (flagMarker.current) flagMarker.current.setMap(null);
        flagMarker.current = new window.kakao.maps.Marker({
          position: moveLatLon,
          map: mapInstance.current,
          image: searchMarkerImage,
          zIndex: 9,
        });

        console.log(`📍 ${firstResult.place_name} 찾음!`);

        // 2단계: 주변 운동시설 검색
        searchNearbyGyms(lat, lng);
      } else {
        alert("검색 결과가 없습니다");
        setLoading(false);
      }
    });
  };

  // 주변 운동시설 검색
  const searchNearbyGyms = (lat, lng) => {
    const ps = new window.kakao.maps.services.Places();
    const keywords = [
      "헬스장",
      "헬스클럽", // ✅ 추가 - 카카오 category_name 실제 표기
      "짐",
      "피트니스",
      "요가",
      "복싱",
      "필라테스",
      "크로스핏",
      "MMA",
      "태권도",
    ];
    let allResults = [];
    let completedSearches = 0;

    console.log("🔍 운동시설 검색 시작...");

    keywords.forEach((keyword) => {
      const options = {
        location: new window.kakao.maps.LatLng(lat, lng),
        radius: radius, // 기본 2000(2km)
        size: 8, //키워드당 검색 리스트 사이즈. 키워드가 10개 있으므로 8입력 시 총 80개 랜더링
      };

      ps.keywordSearch(
        keyword,
        (data, status) => {
          completedSearches++;

          if (status === window.kakao.maps.services.Status.OK) {
            console.log(`✅ ${keyword} ${data.length}개 발견`);
            // ✅ 검색 키워드 태그 추가
            const tagged = data.map((item) => ({
              ...item,
              _matchedFilter: keyword,
            }));
            allResults = [...allResults, ...tagged];
          }

          // 모든 검색 완료 시
          if (completedSearches === keywords.length) {
            // 중복 제거 - 먼저 발견된 항목의 태그 유지
            const seen = new Map();
            allResults.forEach((item) => {
              if (!seen.has(item.id)) seen.set(item.id, item);
            });
            const uniqueResults = Array.from(seen.values());

            // 거리순 정렬
            uniqueResults.sort(
              (a, b) => parseInt(a.distance) - parseInt(b.distance),
            );

            console.log(`🎯 총 ${uniqueResults.length}개 운동시설 발견!`);
            setGyms(uniqueResults);
            setLoading(false);
          }
        },
        options,
      );
    });
  };

  // 마커 표시 (색상 구분 - SVG 버전)
  const displayMarkers = (places) => {
    // 기존 마커 제거
    markers.current.forEach((marker) => marker.setMap(null));
    markers.current = [];

    places.forEach((place) => {
      const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);

      // 카테고리별 마커 색상 결정
      // 카테고리별 마커 색상 결정 (검색 키워드 기준)
      const filterColorMap = {
        헬스장: "#FF0000",
        헬스클럽: "#FF0000",
        짐: "#FF0000",
        피트니스: "#FF0000",
        요가: "#800080",
        필라테스: "#800080",
        복싱: "#0000FF",
        크로스핏: "#FFD700",
        MMA: "#00008B",
        태권도: "#8B4513",
      };
      let markerColor = filterColorMap[place._matchedFilter] || "#FF0000";

      // SVG 마커 생성
     const label = place.place_name.slice(0, 3); // 앞 3글자
const svgMarker = `
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="62" viewBox="0 0 50 62">
    <path d="M25,0 C11.2,0 0,11.2 0,25 C0,43.8 25,62 25,62 S50,43.8 50,25 C50,11.2 38.8,0 25,0 Z"
          fill="${markerColor}" stroke="white" stroke-width="2"/>
    <text x="25" y="29" text-anchor="middle" font-size="11" font-weight="bold"
          fill="white" font-family="sans-serif">${label}</text>
  </svg>
`;

      // SVG를 data URL로 변환
      const svgBlob = new Blob([svgMarker], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      const imageSize = new window.kakao.maps.Size(36, 45); // 마커 실제 크기 (가로, 세로) - 숫자 줄이면 마커 작아짐
const imageOption = { offset: new window.kakao.maps.Point(18, 45) }; // 마커 기준점 (가로중앙, 세로끝) - imageSize 절반, 전체높이와 맞춰야함
      const markerImage = new window.kakao.maps.MarkerImage(
        url,
        imageSize,
        imageOption,
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: mapInstance.current,
        image: markerImage,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedGym(place);
        mapInstance.current.setCenter(markerPosition);
        mapInstance.current.setLevel(3);
        setTimeout(() => {
          const el = document.getElementById(`gym-${place.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);

        // 인포윈도우
        if (infowindow.current) infowindow.current.close();
        const content = `
  <div style="padding:8px 12px; font-size:13px; min-width:150px; position:relative;">
    <button onclick="window.closeInfowindow()"
      style="position:absolute; top:4px; right:8px; background:none; border:none; font-size:16px; cursor:pointer; color:#aaa;">✕</button>
    <strong>${place.place_name}</strong><br/>
    <span style="color:#888;">${place.distance}m</span><br/>
    ${place.phone ? `📞 ${place.phone}` : ""}
  </div>
`;

        infowindow.current = new window.kakao.maps.InfoWindow({ content });
        infowindow.current.open(mapInstance.current, marker);
      });

      markers.current.push(marker);
    });

    console.log(`📍 ${places.length}개 마커 표시 완료!`);
  };
  // 핀 등록 처리
  const handlePinSubmit = async () => {
    // 필수값 체크
    if (!modalForm.nickname.trim()) {
      alert("닉네임을 입력해주세요");
      return;
    }
    if (!modalForm.place_name.trim()) {
      alert("시설명을 입력해주세요");
      return;
    }
    if (!modalForm.facility_type) {
      alert("시설종류를 선택해주세요");
      return;
    }

    // DB에 저장할 데이터
    const pinData = {
      userEmail: modalForm.nickname + "@temp.com", // 임시 (나중에 Firebase로 교체)
      placeName: modalForm.place_name,
      facilityType: modalForm.facility_type,
      comment: modalForm.comment,
      latitude: clickedPosition.lat,
      longitude: clickedPosition.lng,
    };

    try {
      // DB에 저장
      const response = await fetch("http://localhost:8080/api/map/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pinData),
      });

      if (response.ok) {
        console.log("📌 DB 저장 성공!");

        // 지도에 마커 표시
        const svgMarker = `
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="62" viewBox="0 0 50 62">
          <path d="M25,0 C11.2,0 0,11.2 0,25 C0,43.8 25,62 25,62 S50,43.8 50,25 C50,11.2 38.8,0 25,0 Z"
                fill="#FF6B35" stroke="white" stroke-width="2"/>
          <text x="25" y="20" text-anchor="middle" font-size="16" fill="white">📌</text>
          <text x="25" y="36" text-anchor="middle" font-size="9" font-weight="bold"
                fill="white" font-family="sans-serif">${pinData.placeName.slice(0, 3)}</text>
        </svg>
      `;
        const svgBlob = new Blob([svgMarker], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        const imageSize = new window.kakao.maps.Size(36, 45);
        const imageOption = { offset: new window.kakao.maps.Point(18, 45) };
        const markerImage = new window.kakao.maps.MarkerImage(
          url,
          imageSize,
          imageOption,
        );

        const position = new window.kakao.maps.LatLng(
          clickedPosition.lat,
          clickedPosition.lng,
        );
        const marker = new window.kakao.maps.Marker({
          position,
          map: mapInstance.current,
          image: markerImage,
          zIndex: 11,
        });

        // 마커 클릭 시 인포윈도우
        window.kakao.maps.event.addListener(marker, "click", () => {
          if (infowindow.current) infowindow.current.close();
          const content = `
          <div style="padding:12px 16px; font-size:13px; min-width:200px; line-height:1.8; position:relative;">
           <button onclick="window.closeInfowindow()"
             style="position:absolute; top:4px; right:8px; background:none; border:none; font-size:16px; cursor:pointer; color:#aaa;">✕</button>
            <strong style="font-size:15px;">📌 ${pinData.placeName}</strong><br/>
            <span style="color:#3D6B4F;">🏷️ ${pinData.facilityType}</span><br/>
             ${pinData.comment ? `💬 ${pinData.comment}<br/>` : ""}
           <span style="color:#aaa; font-size:11px;">등록자: ${modalForm.nickname}</span>
           </div>
            `;
          infowindow.current = new window.kakao.maps.InfoWindow({ content });
          infowindow.current.open(mapInstance.current, marker);
        });

        alert("📌 핀이 등록됐어요!");
      } else {
        alert("핀 등록에 실패했어요. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("❌ 핀 등록 실패:", error);
      alert("서버 연결에 실패했어요.");
    }

    // 초기화
    setShowModal(false);
    setIsRegisterMode(false);
    setModalForm({
      nickname: "",
      place_name: "",
      facility_type: "",
      comment: "",
    });
    setClickedPosition(null);
  };
  // 리스트 아이템 클릭
  const handleGymClick = (gym) => {
    setSelectedGym(gym);
    const position = new window.kakao.maps.LatLng(gym.y, gym.x);
    mapInstance.current.setCenter(position);
    mapInstance.current.setLevel(3);
  };

  return (
    <div className="map-page">
      <div className="map-hero">
        <h2>주변 운동시설 검색</h2>
        <p>주변 운동 시설을 검색하고, 추천하는 운동시설을 공유해 보아요</p>
      </div>

      {currentLocation && (
        <p className="current-location">
          📍 현재 위치: <strong>{currentLocation.name}</strong>
        </p>
      )}

      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="장소를 검색하세요 (예: 강남역)"
          className="search-input"
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          className="search-button"
          disabled={loading}
        >
          {loading ? "검색중..." : "검색"}
        </button>
        <button
  onClick={handleMyLocation}
  className="my-location-button"
  disabled={loading}
>
  📍 내 주변
</button>



      </div>

      {/* 검색 반경 슬라이더 */}
      <div className="radius-slider">
        <span>반경: {(radius / 1000).toFixed(1)}km</span>
        <input
          type="range"
          min={500}
          max={3000}
          step={500}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          onMouseUp={(e) => {
            if (gyms.length > 0)
              searchNearbyGyms(currentLocation.lat, currentLocation.lng);
          }}
          onTouchEnd={(e) => {
            if (gyms.length > 0)
              searchNearbyGyms(currentLocation.lat, currentLocation.lng);
          }}
        />
      </div>

      {loading && <p className="status">🔍 반경 2km 내 운동시설 검색 중...</p>}

      {/* {gyms.length > 0 && (
        <p className="status success">
          ✅ 전체 {gyms.length}개 / 필터링 {filteredGyms.length}개 표시 중
        </p>
      )} */}

      {/* 통합 필터 영역 */}
      {gyms.length > 0 && (
        <div className="filter-section">
          <div className="filter-checkboxes">
            {Object.keys(filters).map((keyword) => {
              // 색상 매핑
              const colorMap = {
                "헬스/피트니스": "#FF0000",

                "요가/필라테스": "#800080",
                복싱: "#0000FF",

                크로스핏: "#FFD700",
                MMA: "#00008B",
                태권도: "#8B4513",
              };

              return (
                <div
                  key={keyword}
                  className={`filter-chip ${filters[keyword] ? "active" : ""}`}
                  onClick={() => handleFilterChange(keyword)}
                >
                  <span
                    className="color-dot"
                    style={{ backgroundColor: colorMap[keyword] }}
                  ></span>
                  <span>{keyword}</span>
                </div>
              );
            })}
          </div>
          <button onClick={handleSelectAll} className="select-all-btn">
            {Object.values(filters).every((v) => v) ? "전체 해제" : "전체 선택"}
          </button>
        </div>
      )}

      <div className="content-wrapper">
        {/* 지도 영역 */}
        <div ref={mapContainer} className="map-container">
          {!mapLoaded && (
            <div className="loading">🔄 지도를 불러오는 중...</div>
          )}
        </div>

        {/* 리스트 영역 */}
        <div className="gym-list">
          <h3>운동시설 목록 ({filteredGyms.length}개)</h3>
          {filteredGyms.length === 0 ? (
            <p className="no-results">
              {gyms.length === 0
                ? "검색 결과가 없습니다"
                : "필터 조건에 맞는 시설이 없습니다"}
            </p>
          ) : (
            <div className="gym-items">
              {filteredGyms.map((gym) => (
                <div
                  key={gym.id}
                  id={`gym-${gym.id}`}
                  className={`gym-item ${selectedGym?.id === gym.id ? "selected" : ""}`}
                  onClick={() => handleGymClick(gym)}
                >
                  <div className="gym-header">
                    <h4>{gym.place_name}</h4>
                    <span className="distance">{gym.distance}m</span>
                  </div>
                  <p className="category">{gym.category_name}</p>
                  <p className="address">
                    📍 {gym.road_address_name || gym.address_name}
                  </p>
                  {gym.phone && <p className="phone">📞 {gym.phone}</p>}
                  {gym.place_url && (
                    <a
                      href={gym.place_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="kakao-link"
                    >
                      🗺️ 카카오맵에서 보기
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
