const showRecipient = require("./showRecipient")

describe('Test outputs correct name', () => {
    it('Outputs correct person when sent_by is the same as user_id', () => {
        expect(showRecipient({
            "room_id": "255d0f1e-c9d6-4e6b-9755-0207a49faa90",
            "user_id": 3,
            "user_name": "Anike Dorgu",
            "artist_id": 30,
            "artist_name": "Nica Dorgu",
            "last_message": "Socket.io who? XHR ftw bish",
            "sent_by": 3,
            "sent_at": "2020-11-29T13:44:33.095Z"
        }, 3)).toBe("Nica Dorgu")
    });

    it('Outputs correct person when sent_by is not the same as user_id', () => {
        expect(showRecipient({
            "room_id": "255d0f1e-c9d6-4e6b-9755-0207a49faa90",
            "user_id": 3,
            "user_name": "Anike Dorgu",
            "artist_id": 30,
            "artist_name": "Nica Dorgu",
            "last_message": "Socket.io who? XHR ftw bish",
            "sent_by": 3,
            "sent_at": "2020-11-29T13:44:33.095Z"
        }, 30)).toBe("Anike Dorgu")
    });
})