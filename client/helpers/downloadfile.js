import axios from "axios";

export const DownloadFile = (token = null, file = null) => {
	const url = `/api/files/download`;
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token,
		"Content-disposition": file
	};
	axios.get(url, { responseType: "blob", headers: headers }).then(response => {
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", file);
		document.body.appendChild(link);
		link.click();
	});
};
