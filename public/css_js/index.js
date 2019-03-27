let displaymenu = () => {
    check = document.getElementById("mobile-menu").style.display;
    if (check === "block") {
        document.getElementById("mobile-menu").style.animation = "tracking-out-collapse 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000) both";

        setTimeout(() => {
            document.getElementById("mobile-menu").style.display = "none";
        }, 250);
    } else {
        document.getElementById("mobile-menu").style.display = "block";
        document.getElementById("mobile-menu").style.animation = "tracking-in-expand 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000) both";
    }
}