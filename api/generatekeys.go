package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/nbd-wtf/go-nostr"
	"github.com/nbd-wtf/go-nostr/nip19"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	type Key struct {
		Secret string `json:"sk"`
		Public string `json:"pk"`
		Nsec   string `json:"nsec"`
		Npub   string `json:"npub"`
	}

	sk := nostr.GeneratePrivateKey()
	pk, _ := nostr.GetPublicKey(sk)
	nsec, _ := nip19.EncodePrivateKey(sk)
	npub, _ := nip19.EncodePublicKey(pk)

	key := Key{sk, pk, nsec, npub}

	bytes, err := json.Marshal(key)
	if err != nil {
		log.Fatal(err)
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	fmt.Fprintln(w, string(bytes))
}
