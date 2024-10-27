// Copyright (C) 2015-2024 Holger de Carne and contributors
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

package server

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tdrn-org/go-certstore/storage"
)

func (server *serverInstance) export(c *gin.Context) {
	name := c.Param("name")
	entry, err := server.registry.Entry(name)
	if errors.Is(err, storage.ErrNotExist) {
		c.AbortWithError(http.StatusNotFound, err)
		return
	} else if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	//	_, password, encrypt := c.Request.BasicAuth()
	response := newDetails(entry)
	c.JSON(http.StatusOK, response)
}
