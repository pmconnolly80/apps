/**
 * Mock Gmail services that returns mock data
 * by using promises and simulating a slight delay before returning the data.
 *
 */
(function () {

  angular.module('GmailMock', ['lodash'])

    .service('GmailMessages', function($q, $timeout, _) {

      var messages = [
        {
          sender: 'Sarah',
          subject: 'Documents à retourner',
          date: '11:31am',
          labels: ['inbox']
        },
        {
          sender: 'Sarah',
          subject: 'Documents à retourner',
          date: '11:31am',
          labels: ['inbox']
        },
        {
          sender: 'Sarah',
          subject: 'Documents à retourner',
          date: '11:31am',
          labels: ['inbox']
        },
        {
          sender: 'Capitaine Train',
          subject: "Votre justificatif d'achat",
          date: 'Oct 3',
          labels: ['inbox']
        },
        {
          sender: 'Capitaine Train',
          subject: "Votre justificatif d'achat",
          date: 'Oct 3',
          labels: ['inbox']
        },
        {
          sender: 'Capitaine Train',
          subject: "Votre justificatif d'achat",
          date: 'Oct 3',
          labels: ['inbox']
        },
        {
          sender: 'JavaScript Weekly',
          subject: "This week's JavaScript news, issue 201",
          date: 'Oct 3',
          labels: ['inbox']
        },
        {
          sender: 'JavaScript Weekly',
          subject: "This week's JavaScript news, issue 201",
          date: 'Oct 3',
          labels: ['inbox']
        },
        {
          sender: 'JavaScript Weekly',
          subject: "This week's JavaScript news, issue 201",
          date: 'Oct 3',
          labels: ['inbox']
        },
        {
          sender: 'Vincent',
          subject: 'Voici les documents signés',
          date: 'Oct 8',
          labels: ['sent']
        },
        {
          sender: 'Vincent',
          subject: "Merci pour le justificatif d'achat",
          date: 'Oct 4',
          labels: ['sent']
        },
        {
          sender: 'Vincent',
          subject: "Projet de formation AngularJS",
          date: 'now',
          labels: ['drafts']
        },
        {
          sender: 'Important Client',
          subject: "AngularJS Training Dates",
          date: 'Oct 3',
          labels: ['work']
        },
        {
          sender: 'Greg',
          subject: "Gift idea for Sydney",
          date: 'Oct 12',
          labels: ['personal']
        },
        {
          sender: 'Jeff',
          subject: "Forgot to tell you the other day...",
          date: 'Sep 18',
          labels: ['personal']
        }
      ];

      return {
        listInbox:    WrapAsPromise(listInbox),
        listSent:     WrapAsPromise(listSent),
        listDrafts:   WrapAsPromise(listDrafts),
        listForLabel: WrapAsPromise(listForLabel)
      };

      function listInbox() {
        return listForLabel('inbox');
      }

      function listSent() {
        return listForLabel('sent');
      }

      function listDrafts() {
        return listForLabel('drafts');
      }

      function listForLabel(label) {
        return _.filter(messages, function(message) {
          return (_.indexOf(message.labels, label) !== -1);
        });
      }

      /**
       * Helper function that wraps the given callback
       * in a deferred that's automatically resolved after `delay`.
       *
       * This is to simulate an API call over the wire.
       *
       * @return
       *   The promise in the deferred.
       */
      function WrapAsPromise(cb, delay) {
        delay = delay || 700;
        return function() {
          var deferred = $q.defer(),
              args = arguments;  // freeze function arguments
          $timeout(function() {
            deferred.resolve(cb.apply(null, args));
          }, delay);
          return deferred.promise;
        };
      }
    });

})();
