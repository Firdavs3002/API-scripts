context("Pet APIs Tests", () => {
    let petId;
  
    beforeEach(() => {
      cy.request({
        method: 'POST',
        url: 'https://petstore.swagger.io/v2/pet',
        body: {
          id: 123, 
          name: 'Fluffy',
          status: 'available'
        }
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('name', 'Fluffy');
          petId = response.body.id;
        } else {
          cy.log('Failed to add a new pet.');
        }
      });
    });
  
    afterEach(() => {
      if (petId) {
        cy.request('DELETE', `https://petstore.swagger.io/v2/pet/${petId}`)
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      }
    });
  
    it('should update pet information via API', () => {
      if (!petId) {
        cy.log('Skipping test because petId is not defined.');
        return;
      }
  
      const updatedPet = {
        id: petId, 
        name: 'updatedDoggie',
        status: 'available'
      };
    
      cy.request({
        method: 'PUT',
        url: `https://petstore.swagger.io/v2/pet`, 
        body: updatedPet,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq('updatedDoggie');
      });
    });
  
    it('should return pet information for a specific ID', () => {
      if (!petId) {
        cy.log('Skipping test because petId is not defined.');
        return;
      }
  
      cy.request({
        method: 'GET',
        url: `https://petstore.swagger.io/v2/pet/${petId}`
      })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id', petId);
          expect(response.body).to.have.property('name', 'Fluffy');
          expect(response.body).to.have.property('status', 'available');
        });
    });
  });
  