const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const dropDownParent = document.getElementById("dropdownListParent");
const inputs = document.querySelectorAll("input, textarea");
const heading = document.querySelector("h2");
const form = document.getElementById("bookmark-form");

if (!editBtn || !saveBtn || !deleteBtn || !heading || !form) {
    console.log("⚠️ Required DOM elements are missing.");
}

deleteBtn.addEventListener("click", () => {
    try {
        const confirmation = confirm(
            "Are you sure you want to delete this bookmark?"
        );
        if (confirmation) {
            const updatedBookmarks = storedBookmarks.filter(
                (b) => b.id !== bookmarkId
            );
            localStorage.setItem(
                "bookmarks",
                JSON.stringify(updatedBookmarks)
            );
            saveBookmarksToTimestampedFile();
            window.close();
        }
    } catch (error) {
        console.log("⚠️ Error during bookmark deletion:", error);
    }
});

const urlParams = new URLSearchParams(window.location.search);
const bookmarkId = parseInt(urlParams.get("id"));

let storedBookmarks = [];
try {
    storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
} catch (error) {
    console.log("⚠️ Error parsing bookmarks from localStorage:", error);
}

const bookmark = storedBookmarks.find((b) => b.id === bookmarkId);
if (bookmark) {
    try {
        document.getElementById("title").value = bookmark.title;
        document.getElementById("url").value = bookmark.url;
        document.getElementById("category").value = bookmark.category;
        document.getElementById("tags").value = bookmark.tags.join(", ");
        document.getElementById("notes").value = bookmark.notes;
    } catch (error) {
        console.log("⚠️ Error populating bookmark fields:", error);
    }
} else {
    alert("Bookmark not found!");
}

editBtn.addEventListener("click", () => {
    try {
        inputs.forEach((input) => input.removeAttribute("readonly"));
        editBtn.classList.add("hidden");
        saveBtn.classList.remove("hidden");
        deleteBtn.classList.remove("hidden");
        dropDownParent.classList.remove("hidden");
        heading.textContent = "Edit Bookmark";
    } catch (error) {
        console.log("⚠️ Error enabling edit mode:", error);
    }
});

saveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    try {
        if (form.checkValidity()) {
            heading.textContent = "View Bookmark";
            inputs.forEach((input) => input.setAttribute("readonly", true));
            saveBtn.classList.add("hidden");
            deleteBtn.classList.add("hidden");
            editBtn.classList.remove("hidden");
            dropDownParent.classList.add("hidden");

            const updatedBookmark = {
                ...bookmark,
                title: document.getElementById("title").value.trim(),
                url: document.getElementById("url").value.trim(),
                category: document.getElementById("category").value.trim(),
                tags: document
                    .getElementById("tags")
                    .value.split(",")
                    .map((tag) => tag.trim()),
                notes: document.getElementById("notes").value.trim(),
            };

            const updatedBookmarks = storedBookmarks.map((b) => b.id === bookmarkId ? updatedBookmark : b);
            localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
            saveBookmarksToTimestampedFile();
        } else {
            alert("Please fill in all required fields correctly.");
        }
    } catch (error) {
        console.log("⚠️ Error saving the bookmark:", error);
    }
});

function delete_bookmark() {
    try {
        const confirmation = confirm("Are you sure you want to delete this bookmark?");
        if (confirmation) {
            const updatedBookmarks = storedBookmarks.filter((b) => b.id !== bookmarkId);
            localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
            saveBookmarksToTimestampedFile();
            window.close();
        }
    } catch (error) {
        console.log("⚠️ Error deleting the bookmark:", error);
    }
}
